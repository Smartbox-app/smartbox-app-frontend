import { addDays, endOfDay, startOfDay, startOfToday } from 'date-fns';
import React, { useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import {
  AddonUserFileRequirementType,
  RentAgreementType,
  RentPaymentType,
  StockAgreementType,
  StockPaymentType,
} from 'smartbox-types';
import {
  clearPaymentDetails,
  setMinDaysForInstallments,
  setOrderFullStock,
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
import { history } from 'src/history';
import { useBridgeCalculatedPriceToRedux } from 'src/hooks/useBridgeOrderPriceQuery';
import { useSyncAddonPricesToRedux } from 'src/hooks/useSyncAddonPricesToRedux';
import { useTracking } from 'src/hooks/useTracking';
import { ArrowLeft, ArrowRight } from 'src/icons';
import { useGetMyDetailsQuery, useGetStockQuery } from 'src/queries';
import { useBoxGroupPriceQuery } from 'src/queries/useRentPriceQueries';
import { ApplicationState } from 'src/reducers';
import { ClassValidatorResolver } from 'src/resolvers/ClassValidatorResolver';
import UserService from 'src/services/user-service';
import { resolveCheckoutAgreementType } from 'src/utils/agreement-policy';
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

import 'src/views/DashboardCommon/Order/Form/StepDuration/StepDuration.scss';

const StyledCalendarPicker = styled.div`
  justify-content: center;
  gap: 20px;
`;

const StyledStartDateField = styled.div`
  display: flex;
  flex-direction: column;
`;

const StepDuration = () => {
  const { data: user } = useGetMyDetailsQuery();
  const dispatch = useDispatch();
  const { trackInitiateCheckout } = useTracking();
  const minRentPeriod = useSelector(
    (state: ApplicationState) => state.order.minRentPeriod,
  );
  const maxRentPeriod = useSelector(
    (state: ApplicationState) => state.order.maxRentPeriod,
  );
  const maxAdvanceBookingDays = useSelector(
    (state: ApplicationState) => state.order.maxAdvanceBookingDays,
  );
  // box groupId is used directly only when new rent is created
  const {
    stock,
    stockId,
    startDate,
    endDate,
    loadingPrice,
    orderAddons,
    calculatedPrice,
    rentPaymentType,
    agreementType,
    minRentDaysForInstallments,
    boxGroupId,
    boxGroupName,
    boxGroupArea,
    stockName,
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

  const { data: stockData } = useGetStockQuery(stockId);

  useEffect(() => {
    if (stockData) {
      dispatch(setOrderFullStock(stockData));
    }
  }, [stockData, dispatch]);

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

    if (isOpenEnded) {
      if (rentPaymentType !== RentPaymentType.Installments) {
        dispatch(setRentPaymentType(RentPaymentType.Installments));
      }
      return;
    }

    if (rentPaymentType) return;

    switch (paymentMethods || stock.clientPaymentTypeConfig) {
      case StockPaymentType.InAdvance: {
        dispatch(setRentPaymentType(RentPaymentType.InAdvance));
        break;
      }
      case StockPaymentType.Installments: {
        dispatch(setRentPaymentType(RentPaymentType.Installments));
        break;
      }
      default: {
        dispatch(setRentPaymentType(RentPaymentType.InAdvance));
        break;
      }
    }
  }, [stock, isOpenEnded, paymentMethods]);

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

  if (!user || !minRentPeriod || maxRentPeriod === null) return null;

  const summaryPath = `/${UserService.getSlugByRole(user.role)}/order/step/summary`;

  const handleContinue = () => {
    const payload = buildInitiateCheckoutPayload(
      { calculatedPrice, orderAddons },
      {
        boxGroupId,
        boxGroupName,
        boxGroupArea,
        stockName,
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
    history.push(summaryPath);
  };

  return (
    <form className="form-step-two">
      <Stack>
        {stock?.allowedAgreementType === StockAgreementType.Both ? (
          <AgreementTypeSelect />
        ) : null}
        <Section>
          {loadingPrice && <Spinner halfTransparent overlay />}
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
        <Price />
        <Section>
          <ButtonsContainer spaceBetween>
            <Button
              variant="secondary"
              size="large"
              text="application.back"
              type="button"
              iconLeft={<ArrowLeft />}
              to={`/${UserService.getSlugByRole(user.role)}/order/step/stock`}
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
