import React, { useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';

import { useDispatch, useSelector } from 'react-redux';

import { addDays, endOfDay, startOfDay, startOfToday } from 'date-fns';
import {
  AddonUserFileRequirementType,
  RentAgreementType,
  RentPaymentType,
  StockAgreementType,
  StockPaymentType,
  StockRes,
} from 'smartbox-types';
import { DateInput } from '../../../../../components/Common';
import { __ } from '../../../../../helpers/i18n';
import { StyledInputHelp } from '../../../../../components/Common/input-styled';
import { Spinner } from '../../../../../components/Branded';
import { ButtonsContainer } from '../../../../../components/Layout';
import { ApplicationState } from '../../../../../reducers';
import UserService from '../../../../../services/user-service';

import Price from '../Common/Price';

import './StepDuration.scss';

import styled from 'styled-components';
import {
  calculateAddonPrice,
  calculateOpenEndedAddonPrice,
  calculateOpenEndedPrice,
  calculatePrice,
  clearAddonPrice,
  clearPaymentDetails,
  setMinDaysForInstallments,
  setOrderFullStock,
  setRentAgreementType,
  setRentEndDate,
  setRentPaymentType,
  setRentStartDate,
} from '../../../../../actions/order';
import { Addons } from '../Common/Addons';
import { PaymentType } from '../Common/PaymentType';
import { AgreementTypeSelect } from '../Common/AgreementTypeSelect';
import ApiService from '../../../../../services/api-service';
import { useGetMyDetailsQuery } from 'src/queries';
import { Button, Section, Stack } from 'src/components/ui';
import { ArrowLeft, ArrowRight } from 'src/icons';
import { RentDurationDto } from 'src/dto/RentDurationDto';
import { ClassValidatorResolver } from 'src/resolvers/ClassValidatorResolver';
import { RentDuration } from '../Common/RentDuration';
import { history } from 'src/history';
import { useTracking } from 'src/hooks/useTracking';
import { resolveCheckoutAgreementType } from 'src/utils/agreement-policy';
import {
  clampedFixedTermEndDate,
  initialFixedTermEndDate,
  isNewRentPeriodAcceptable,
} from 'src/utils/rent-period-bounds';
import { buildInitiateCheckoutPayload } from 'src/utils/build-initiate-checkout-payload';

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
    orderAddonsId,
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

  const getStock = async () => {
    await ApiService.callFetch('GET', `stock/${stockId}`, (res: StockRes) => {
      dispatch(setOrderFullStock(res));
    });
  };

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
        return;
      }
      getStock();
      dispatch(calculateOpenEndedPrice(boxGroupId, startOfDay(startDate)));
      calculateAllAddons();
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

    getStock();

    const startOfStart = startOfDay(startDate);
    const endOfEnd = endOfDay(endDate);
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
      return;
    }

    dispatch(
      calculatePrice(
        boxGroupId,
        startOfStart,
        endOfEnd,
        rentPaymentType || RentPaymentType.InAdvance,
      ),
    );

    calculateAllAddons();
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
    calculateAllAddons();
  }, [orderAddonsId]);

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

  const calculateAllAddons = () => {
    if (isOpenEnded) {
      Object.keys(orderAddons).forEach((addonId) => {
        const addon = orderAddons[addonId];
        if (addon.selectedVariant) {
          dispatch(
            calculateOpenEndedAddonPrice(
              addonId,
              startDate,
              addon.selectedVariant,
              boxGroupId,
            ),
          );
          return;
        }
        dispatch(clearAddonPrice(addonId));
      });
      return;
    }
    if (!endDate) return;
    Object.keys(orderAddons).forEach((addonId) => {
      const addon = orderAddons[addonId];
      if (addon.selectedVariant)
        dispatch(
          calculateAddonPrice(
            addonId,
            startDate,
            endDate,
            rentPaymentType || RentPaymentType.InAdvance,
            addon.selectedVariant,
            boxGroupId,
          ),
        );
      else dispatch(clearAddonPrice(addonId));
    });
  };

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
