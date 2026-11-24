import { addDays, endOfDay, startOfDay, startOfToday } from 'date-fns';
import React, { useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import styled from 'styled-components';

import {
  AddonUserFileRequirementType,
  RentAgreementType,
  RentPaymentType,
  StockAgreementType,
} from 'smartbox-types';
import {
  clearPaymentDetails,
  setMinDaysForInstallments,
  setRentAgreementType,
  setRentEndDate,
  setRentPaymentType,
  setRentStartDate,
} from 'src/actions/order';
import { Spinner } from 'src/components/Branded';
import { DateInput } from 'src/components/Common';
import { StyledInputHelp } from 'src/components/Common/input-styled';
import { ButtonsContainer } from 'src/components/Layout';
import { Button, Section, Stack } from 'src/components/ui';
import { RentDurationDto } from 'src/dto/RentDurationDto';
import { __ } from 'src/helpers/i18n';
import { useBridgeCalculatedPriceToRedux } from 'src/hooks/useBridgeOrderPriceQuery';
import { useSyncAddonPricesToRedux } from 'src/hooks/useSyncAddonPricesToRedux';
import { useTracking } from 'src/hooks/useTracking';
import { ArrowLeft, ArrowRight } from 'src/icons';
import { useGetMyDetailsQuery } from 'src/queries';
import { useBoxGroupPriceQuery } from 'src/queries/useRentPriceQueries';
import { ApplicationState } from 'src/reducers';
import { ClassValidatorResolver } from 'src/resolvers/ClassValidatorResolver';
import { OrderLoadError } from 'src/views/DashboardCommon/Order/OrderLoadError';
import { useOrderStep } from 'src/views/DashboardCommon/Order/RouteWithIndicator';
import { useOrderPaths } from 'src/views/DashboardCommon/Order/useOrderPaths';
import { useOrderSelection } from 'src/views/DashboardCommon/Order/useOrderSelection';
import {
  resolveCheckoutAgreementType,
  resolveCheckoutPaymentType,
} from 'src/utils/agreement-policy';
import { buildInitiateCheckoutPayload } from 'src/utils/build-initiate-checkout-payload';
import {
  clampedFixedTermEndDate,
  initialFixedTermEndDate,
  isNewRentPeriodAcceptable,
} from 'src/utils/rent-period-bounds';
import { Addons } from 'src/views/DashboardCommon/Order/Form/Common/Addons';
import { AgreementTypeSelect } from 'src/views/DashboardCommon/Order/Form/Common/AgreementTypeSelect';
import { PaymentType } from 'src/views/DashboardCommon/Order/Form/Common/PaymentType';
import Price from 'src/views/DashboardCommon/Order/Form/Common/Price';
import { RentDuration } from 'src/views/DashboardCommon/Order/Form/Common/RentDuration';

import './StepDuration.scss';

const StyledCalendarPicker = styled.div`
  justify-content: center;
  gap: 20px;
`;

const StyledStartDateField = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledPriceWrap = styled.div`
  position: relative;
`;

const StepDuration = () => {
  useOrderStep('duration');
  const { data: user } = useGetMyDetailsQuery();
  const { goToSize, goToSummary } = useOrderPaths();
  const dispatch = useDispatch();
  const { trackInitiateCheckout } = useTracking();
  const { stockId = '', boxGroupId = '' } = useParams<{
    stockId: string;
    boxGroupId: string;
  }>();
  const { stock, boxGroup, pending, failed } = useOrderSelection(
    stockId,
    boxGroupId,
  );
  const minRentPeriod = boxGroup?.minRentPeriod ?? null;
  const maxRentPeriod = boxGroup?.maxRentPeriod ?? null;
  const maxAdvanceBookingDays = boxGroup?.maxAdvanceBookingDays ?? null;
  const {
    startDate,
    endDate,
    loadingPrice,
    orderAddons,
    calculatedPrice,
    rentPaymentType,
    agreementType,
    minRentDaysForInstallments,
  } = useSelector((state: ApplicationState) => state.order);

  const selectedAgreementType = resolveCheckoutAgreementType(
    stock?.allowedAgreementType,
    agreementType,
  );
  const isOpenEnded = selectedAgreementType === RentAgreementType.OpenEnded;
  const periodDays = stock?.openEndedPeriodDays || 30;
  const paymentMethods = stock?.clientPaymentTypeConfig;

  const priceQueryEnabled = useMemo(() => {
    if (!minRentPeriod || !boxGroupId) return false;
    if (isOpenEnded) return !endDate;
    if (!endDate) return false;
    return !clampedFixedTermEndDate(
      startDate,
      endDate,
      rentPaymentType,
      minRentPeriod,
      maxRentPeriod,
      minRentDaysForInstallments,
    );
  }, [
    minRentPeriod,
    boxGroupId,
    isOpenEnded,
    endDate,
    startDate,
    rentPaymentType,
    maxRentPeriod,
    minRentDaysForInstallments,
  ]);

  const rentPriceQuery = useBoxGroupPriceQuery({
    boxGroupId,
    start: startOfDay(startDate),
    end: endDate ? endOfDay(endDate) : undefined,
    type: rentPaymentType || RentPaymentType.InAdvance,
    openEnded: isOpenEnded,
    enabled: priceQueryEnabled,
  });
  useBridgeCalculatedPriceToRedux(rentPriceQuery);

  useSyncAddonPricesToRedux({
    orderAddons,
    startDate,
    endDate,
    rentPaymentType,
    boxGroupId,
    openEnded: isOpenEnded,
  });

  useEffect(() => {
    if (!stock) return;
    const nextType = resolveCheckoutAgreementType(
      stock.allowedAgreementType,
      agreementType,
    );
    if (nextType !== agreementType) {
      dispatch(setRentAgreementType(nextType));
    }
  }, [stock, agreementType]);

  useEffect(() => {
    if (!minRentPeriod) return;
    if (isOpenEnded) {
      if (endDate) {
        dispatch(setRentEndDate(null));
      }
      return;
    }
    if (!endDate) {
      const nextEnd = initialFixedTermEndDate(
        startDate,
        rentPaymentType,
        minRentPeriod,
        minRentDaysForInstallments,
      );
      if (nextEnd) dispatch(setRentEndDate(nextEnd));
      return;
    }

    const clampedEnd = clampedFixedTermEndDate(
      startDate,
      endDate,
      rentPaymentType,
      minRentPeriod,
      maxRentPeriod,
      minRentDaysForInstallments,
    );
    if (clampedEnd) {
      dispatch(setRentEndDate(clampedEnd));
    }
  }, [
    startDate,
    endDate,
    minRentPeriod,
    maxRentPeriod,
    rentPaymentType,
    minRentDaysForInstallments,
    isOpenEnded,
  ]);

  useEffect(() => {
    if (!stock) return;

    dispatch(setMinDaysForInstallments(stock.minRentDaysForInstallments));

    const nextPaymentType = resolveCheckoutPaymentType(
      paymentMethods || stock.clientPaymentTypeConfig,
      rentPaymentType,
      isOpenEnded,
    );
    if (rentPaymentType !== nextPaymentType) {
      dispatch(setRentPaymentType(nextPaymentType));
    }
  }, [stock, isOpenEnded, paymentMethods, rentPaymentType]);

  const setMinDate = (addAmount = 0, end?: boolean) => {
    return addDays(end ? startDate : startOfToday(), addAmount);
  };

  const setMaxDateForEnd = (addAmount = 0) =>
    endOfDay(addDays(startDate, addAmount));

  const advanceBookingDays = maxAdvanceBookingDays ?? 14;

  const setMaxDateForStart = () => addDays(startOfToday(), advanceBookingDays);

  const defaultValues = {
    startDate: addDays(startDate, 0),
    endDate: addDays(startDate, 1),
  };

  useEffect(() => {
    if (!user) return;
    dispatch(clearPaymentDetails());
  }, []);

  const { reset, control } = useForm<RentDurationDto>({
    defaultValues,
    mode: 'onSubmit',
    resolver: ClassValidatorResolver(new RentDurationDto()),
  });

  useEffect(() => {
    if (!minRentPeriod) return;

    reset({
      startDate: addDays(startDate, 0),
      endDate: addDays(startDate, minRentPeriod - 1),
    });
  }, [minRentPeriod]);

  useEffect(() => {
    if (!endDate) return;

    reset({
      endDate,
    });
  }, [endDate]);

  useEffect(() => {
    if (!startDate) return;

    reset({
      startDate,
    });
  }, [startDate]);

  const allRequiredAddonsSelected = useMemo(() => {
    const addonIds = Object.keys(orderAddons);

    for (const addonId of addonIds) {
      const orderAddon = orderAddons[addonId];
      if (orderAddon.required && !orderAddon.selectedVariant) {
        if (!orderAddon.userFileAllowed) return false;
        if (
          !orderAddon.file &&
          orderAddon.userFileAllowed &&
          orderAddon.userFileRequirement !==
            AddonUserFileRequirementType.Optional
        )
          return false;
      }

      for (const acceptance of orderAddon.acceptances) {
        if (
          orderAddon.selectedVariant &&
          acceptance &&
          acceptance.required &&
          !orderAddon.acceptancesStatus[acceptance.id].accepted
        ) {
          return false;
        }
      }

      if (orderAddon.userFileAllowed) {
        if (
          orderAddon.userFileRequirement ===
            AddonUserFileRequirementType.Required &&
          !orderAddon.file
        ) {
          return false;
        }
      }
    }

    return true;
  }, [orderAddons]);

  const correctPeriodSelected = useMemo(() => {
    return isNewRentPeriodAcceptable({
      startDate,
      endDate,
      isOpenEnded,
      minRentPeriod,
      maxRentPeriod,
      rentPaymentType,
      minRentDaysForInstallments,
    });
  }, [
    startDate,
    endDate,
    minRentPeriod,
    maxRentPeriod,
    rentPaymentType,
    minRentDaysForInstallments,
  ]);

  if (failed) return <OrderLoadError />;

  if (!user || pending || !boxGroup || !minRentPeriod) return null;

  const handleContinue = () => {
    const payload = buildInitiateCheckoutPayload(
      { calculatedPrice, orderAddons },
      {
        boxGroupId,
        boxGroupName: boxGroup.name,
        boxGroupArea: boxGroup.area ? String(boxGroup.area) : '',
        stockName: stock?.name,
        paymentType: 'new_rent',
      },
    );
    if (payload) {
      trackInitiateCheckout({
        ...payload,
        email: user.email,
        userId: user.id,
      });
    }
    goToSummary({ stockId, boxGroupId });
  };

  return (
    <form className="form-step-two">
      <Stack>
        {stock?.allowedAgreementType === StockAgreementType.Both ? (
          <AgreementTypeSelect />
        ) : null}
        <Section>
          <StyledCalendarPicker className="calendars-picker-wrapper">
            <StyledStartDateField>
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <DateInput
                    {...field}
                    value={startDate!}
                    name="startDate"
                    highlightStart={startDate}
                    highlightEnd={isOpenEnded ? undefined : endDate}
                    label="application.selectStartRentDate"
                    minDate={setMinDate()}
                    maxDate={setMaxDateForStart()}
                    onChange={([selected]: Date[]) => {
                      dispatch(setRentStartDate(selected));
                    }}
                  />
                )}
              />
            </StyledStartDateField>
            {!isOpenEnded ? (
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <DateInput
                    {...field}
                    value={endDate!}
                    name="endDate"
                    highlightStart={startDate}
                    highlightEnd={endDate}
                    label="application.selectEndRentDate"
                    minDate={setMinDate(minRentPeriod - 1, true)}
                    maxDate={
                      maxRentPeriod
                        ? setMaxDateForEnd(maxRentPeriod - 1)
                        : undefined
                    }
                    onChange={([selected]: Date[]) => {
                      dispatch(setRentEndDate(selected));
                    }}
                  />
                )}
              />
            ) : null}
          </StyledCalendarPicker>
          {isOpenEnded ? (
            <StyledInputHelp $size="medium">
              <span className="fa fa-info-circle" />{' '}
              {__('application.openEndedPeriodInfo', { days: periodDays })}
            </StyledInputHelp>
          ) : null}
          <StyledInputHelp $size="medium">
            <span className="fa fa-info-circle" />{' '}
            {__('application.maxAdvanceBookingDaysInfo', {
              days: advanceBookingDays,
            })}
          </StyledInputHelp>
          {!isOpenEnded ? <RentDuration /> : null}
        </Section>

        {stock && !isOpenEnded ? <PaymentType stock={stock} /> : null}
        <Addons stockId={stockId} boxGroupId={boxGroupId} />
        <StyledPriceWrap>
          {loadingPrice && <Spinner halfTransparent overlay />}
          <Price />
        </StyledPriceWrap>
        <Section>
          <ButtonsContainer spaceBetween>
            <Button
              variant="secondary"
              size="large"
              text="application.back"
              type="button"
              iconLeft={<ArrowLeft />}
              onClick={() => goToSize(stockId, boxGroupId)}
            />
            <Button
              type="button"
              onClick={handleContinue}
              size="large"
              text="application.next"
              iconRight={<ArrowRight />}
              disabled={
                !correctPeriodSelected ||
                !allRequiredAddonsSelected ||
                !stock ||
                (!isOpenEnded && !endDate) ||
                !calculatedPrice ||
                calculatedPrice.length === 0
              }
            />
          </ButtonsContainer>
        </Section>
      </Stack>
    </form>
  );
};

export default StepDuration;
