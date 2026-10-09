import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { addDays, differenceInCalendarDays } from 'date-fns';
import {
  AddonUserFileRequirementType,
  DebtResolveType,
  RentPaymentType,
  RentStatus,
  StockPaymentType,
  StockRes,
} from 'smartbox-types';
import { DateInput } from '../../../../../components/Common';
import { Spinner } from '../../../../../components/Branded';
import { ButtonsContainer } from '../../../../../components/Layout';
import { ApplicationState } from '../../../../../reducers';
import UserService from '../../../../../services/user-service';

import Price from '../Common/Price';

import './StepDuration.scss';

import styled from 'styled-components';
import {
  calculateAddonPrice,
  calculatePriceForRent,
  clearAddonPrice,
  clearPaymentDetails,
  setMinDaysForInstallments,
  setOrderFullStock,
  setOrderStock,
  setRentEndDate,
  setRentPaymentType,
  setRentStartDate,
} from '../../../../../actions/order';
import { Addons } from '../Common/Addons';
import ApiService from '../../../../../services/api-service';
import { PaymentType } from '../Common/PaymentType';
import { getPeriodConfigForExtendingRent } from '../../../../../actions/single-rent';
import { useGetMyDetailsQuery, useMyRentDetailsQuery } from 'src/queries';
import { Button, Section, Stack } from 'src/components/ui';
import { ArrowRight } from 'src/icons';
import { dateOnly } from 'src/utils/format-date';
import {
  debtOnlyResolvedEnd,
  extensionMaxSelectableDate,
  extensionMinimumEnd,
  extensionMinSelectableDate,
  extensionStartFromFinish,
  isExtensionPeriodAcceptable,
  minPeriodDebtResolvedEnd,
} from 'src/utils/rent-period-bounds';
import { useTenant } from 'src/hooks/useTenant';
import { RentDuration } from '../Common/RentDuration';
import { history } from 'src/history';
import { useTracking } from 'src/hooks/useTracking';
import { buildInitiateCheckoutPayload } from 'src/utils/build-initiate-checkout-payload';

const StyledCalendarPicker = styled.div`
  margin: 0 -10px;
`;

const StepExtensionDuration = () => {
  const { data: user } = useGetMyDetailsQuery();
  const dispatch = useDispatch();
  const { trackInitiateCheckout } = useTracking();
  const { rentId } = useParams<{ step: string; rentId?: string }>();
  const { tenant } = useTenant();
  const { data: rent } = useMyRentDetailsQuery(rentId);
  const minRentPeriod = useSelector(
    (state: ApplicationState) => state.order.minRentPeriod,
  );
  const maxRentPeriod = useSelector(
    (state: ApplicationState) => state.order.maxRentPeriod,
  );
  // box groupId is used directly only when new rent is created
  const {
    stock,
    startDate,
    endDate,
    loadingPrice,
    rentPaymentType,
    orderAddons,
    orderAddonsId,
    minRentDaysForInstallments,
    calculatedPrice,
  } = useSelector((state: ApplicationState) => state.order);

  const getStock = async () => {
    if (!rent) return;
    await ApiService.callFetch(
      'GET',
      `stock/${rent.stockId}`,
      (res: StockRes) => {
        dispatch(setOrderFullStock(res));
      },
    );
  };

  // get rent details if it is extended
  useEffect(() => {
    if (!rentId) return;

    dispatch(getPeriodConfigForExtendingRent(rentId));
  }, [rentId, dispatch]);

  useEffect(() => {
    if (!rent) return;
    getStock();

    dispatch(setRentStartDate(extensionStartFromFinish(rent.finishAt ?? null)));
    dispatch(setOrderStock(rent.stockId, rent.stockName, rent.stockAddress));
  }, [rent]);

  useEffect(() => {
    if (!rent || !minRentPeriod || !tenant) return;

    const unpaidExtension = [
      RentStatus.noPaidExtension,
      RentStatus.noPaidExtensionWithWarning,
    ].includes(rent.status);

    if (unpaidExtension && tenant.debtResolveType === DebtResolveType.DebtOnly) {
      dispatch(setRentEndDate(debtOnlyResolvedEnd(new Date())));
      return;
    }
    if (unpaidExtension && tenant.debtResolveType === DebtResolveType.MinPeriod) {
      dispatch(
        setRentEndDate(
          minPeriodDebtResolvedEnd(
            new Date(),
            rent.finishAt ?? null,
            minRentPeriod,
          ),
        ),
      );
      return;
    }

    const difference = endDate
      ? differenceInCalendarDays(endDate, startDate)
      : null;

    if (
      rentPaymentType === RentPaymentType.Installments &&
      minRentDaysForInstallments
    ) {
      if (difference && difference >= minRentDaysForInstallments) return;

      dispatch(
        setRentEndDate(
          extensionMinimumEnd(
            rent.finishAt ?? null,
            minRentDaysForInstallments,
            new Date(),
          ),
        ),
      );
    } else {
      if (difference && difference >= minRentPeriod) return;

      dispatch(
        setRentEndDate(
          extensionMinimumEnd(rent.finishAt ?? null, minRentPeriod, new Date()),
        ),
      );
    }
  }, [
    minRentPeriod,
    minRentDaysForInstallments,
    rent,
    tenant,
    rentPaymentType,
  ]);

  useEffect(() => {
    if (!rentId || !endDate) return;
    dispatch(
      calculatePriceForRent(
        rentId,
        startDate,
        endDate,
        rentPaymentType || RentPaymentType.InAdvance,
      ),
    );
    calculateAllAddons();
  }, [startDate, endDate, rentId, rentPaymentType]);

  useEffect(() => {
    calculateAllAddons();
  }, [orderAddonsId]);

  useEffect(() => {
    if (!stock || rentPaymentType || !rent) return;

    dispatch(setMinDaysForInstallments(stock.minRentDaysForInstallments));

    if (
      [
        RentStatus.noPaidExtension,
        RentStatus.noPaidExtensionWithWarning,
      ].includes(rent.status)
    ) {
      dispatch(setRentPaymentType(RentPaymentType.InAdvance));
      return;
    }

    switch (stock.clientPaymentTypeConfig) {
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
  }, [stock, rentPaymentType, rent]);

  const calculateAllAddons = () => {
    if (!endDate || !rent) return;
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
            rent.boxGroupId,
          ),
        );
      else dispatch(clearAddonPrice(addonId));
    });
  };

  const isDebtOnly =
    !!rent &&
    [
      RentStatus.noPaidExtension,
      RentStatus.noPaidExtensionWithWarning,
    ].includes(rent.status) &&
    tenant?.debtResolveType === DebtResolveType.DebtOnly;

  const setMinDate = (addAmount = 0) => {
    if (!rent) return;

    return extensionMinSelectableDate({
      finishAt: rent.finishAt ?? null,
      addAmount,
      now: new Date(),
      debtOnly: isDebtOnly,
    });
  };

  const setMaxDateForEnd = (addAmount = 0) => {
    if (!rent) return;

    return extensionMaxSelectableDate({
      startDate,
      addAmount,
      now: new Date(),
      debtOnly: isDebtOnly,
    });
  };

  useEffect(() => {
    if (!user) return;
    dispatch(clearPaymentDetails());
  }, []);

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
    return isExtensionPeriodAcceptable({
      hasRent: !!rent,
      startDate,
      endDate,
      minRentPeriod,
      maxRentPeriod,
      rentPaymentType,
      minRentDaysForInstallments,
      unpaidExtension: !!rent && [
        RentStatus.noPaidExtension,
        RentStatus.noPaidExtensionWithWarning,
      ].includes(rent.status),
    });
  }, [
    rent,
    startDate,
    endDate,
    minRentPeriod,
    maxRentPeriod,
    rentPaymentType,
    minRentDaysForInstallments,
  ]);

  if (!user) return null;

  if (!rent || !minRentPeriod || maxRentPeriod === null)
    return <Spinner overlay />;

  const summaryPath = `/${UserService.getSlugByRole(user.role)}/order/step/summary/${rentId}`;

  const handleContinue = () => {
    const payload = buildInitiateCheckoutPayload(
      { calculatedPrice, orderAddons },
      {
        boxGroupId: rent.boxGroupId,
        boxGroupArea: String(rent.size),
        stockName: rent.stockName,
        paymentType: 'extension',
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
        {loadingPrice && <Spinner halfTransparent overlay />}
        {![
          RentStatus.noPaidExtension,
          RentStatus.noPaidExtensionWithWarning,
        ].includes(rent.status) ? (
          <Section>
            <StyledCalendarPicker className="calendars-picker-wrapper">
              <DateInput
                name="endDate"
                label="application.selectEndRentDate"
                minDate={setMinDate(minRentPeriod)}
                maxDate={
                  maxRentPeriod
                    ? setMaxDateForEnd(maxRentPeriod - 1)
                    : undefined
                }
                highlightStart={startDate}
                highlightEnd={endDate}
                value={endDate || undefined}
                onChange={([selected]: Date[]) => {
                  dispatch(setRentEndDate(selected));
                }}
              />
            </StyledCalendarPicker>
            <RentDuration />
          </Section>
        ) : null}
        {rent &&
        [
          RentStatus.noPaidExtension,
          RentStatus.noPaidExtensionWithWarning,
        ].includes(rent.status) ? (
          <Section>
            <p>
              Opłacasz zaległość dla Twojego wynajmu{' '}
              <strong>
                {dateOnly(addDays(new Date(rent.finishAt ?? new Date()), 1))}
              </strong>{' '}
              -{' '}
              {endDate ? <strong>{dateOnly(endDate)}</strong> : null}
            </p>
          </Section>
        ) : null}

        <Addons stockId={rent.stockId} boxGroupId={rent.boxGroupId} />

        {stock ? <PaymentType stock={stock} rent={rent} /> : null}
        <Price />
        <Section>
          <ButtonsContainer spaceBetween>
            <span />
            <Button
              type="button"
              size="large"
              onClick={handleContinue}
              text="application.next"
              iconRight={<ArrowRight />}
              disabled={
                !correctPeriodSelected ||
                !allRequiredAddonsSelected ||
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

export default StepExtensionDuration;
