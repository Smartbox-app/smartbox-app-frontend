import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect, useDispatch, useSelector } from 'react-redux';

import {
  addDays,
  differenceInCalendarDays,
  differenceInDays,
  endOfDay,
  format,
  isBefore,
  parseISO,
  startOfDay,
} from 'date-fns';
import {
  AddonUserFileRequirementType,
  DebtResolveType,
  MyRentDetails,
  MyRentList,
  RentPaymentType,
  RentStatus,
  StockPaymentType,
  StockRes,
  UserRes,
} from 'smartbox-types';
import { DateInput } from '../../../../../components/Common';
import { Spinner } from '../../../../../components/Branded';
import { order } from '../../../../../actions';
import { ButtonsContainer } from '../../../../../components/Layout';
import { FormType } from '../../../../../types/order-form';
import { ApplicationState } from '../../../../../reducers';
import UserService from '../../../../../services/user-service';

import Price from '../Common/Price';

import './StepDuration.scss';

import styled from 'styled-components';
import {
  calculateAddonPrice,
  calculatePriceForRent,
  clearAddonPrice,
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
import { useGetMyDetailsQuery } from 'src/queries';
import { Button, Section, Stack } from 'src/components/ui';
import { ArrowRight } from 'src/icons';
import { dateOnly, dateOnlyNormalized } from 'src/utils/format-date';
import { useTenant } from 'src/hooks/useTenant';
import { RentDuration } from '../Common/RentDuration';

const StyledCalendarPicker = styled.div`
  margin: 0 -10px;
`;

interface Props {
  history: any;
  formData: FormType;
  stockId: string;
  rent: MyRentList;
  clearPaymentDetails: () => void;
}

const StepExtensionDuration = ({ clearPaymentDetails }: Props) => {
  const { data: user } = useGetMyDetailsQuery();
  const dispatch = useDispatch();
  const { rentId, step } = useParams<{ step: string; rentId?: string }>();
  const { tenant } = useTenant();
  const [rent, setRent] = useState<MyRentDetails>();
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
  } = useSelector((state: ApplicationState) => state.order);
  const [loading, setLoading] = useState<boolean>(false);

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
  const getSingleRent = async () => {
    setLoading(true);
    await ApiService.callFetch(
      'GET',
      `rent/my-details/${rentId}`,
      (data: MyRentDetails) => {
        setRent(data);
      },
    );
    setLoading(false);
  };

  useEffect(() => {
    if (!rentId) return;

    dispatch(getPeriodConfigForExtendingRent(rentId));
    getSingleRent();
  }, [rentId]);

  useEffect(() => {
    if (!rent) return;
    getStock();

    const normalizedStart = dateOnlyNormalized(rent.finishAt);

    const parsedStart = new Date(`${normalizedStart} 00:00:00`);
    const added = addDays(parsedStart, 1);
    dispatch(setRentStartDate(added));
    dispatch(setOrderStock(rent.stockId, rent.stockName, rent.stockAddress));
  }, [rent]);

  const setRentEndDateAccordingToType = (
    startDate: Date,
    rentPaymentType: RentPaymentType | null,
    minRentPeriod: number,
    minRentDaysForInstallments: number | null,
  ) => {
    switch (rentPaymentType) {
      case RentPaymentType.Installments: {
        if (!minRentDaysForInstallments) return;
        dispatch(
          setRentEndDate(
            endOfDay(addDays(startDate, minRentDaysForInstallments - 1)),
          ),
        );
        break;
      }
      default: {
        dispatch(
          setRentEndDate(endOfDay(addDays(startDate, minRentPeriod - 1))),
        );
        break;
      }
    }
  };

  useEffect(() => {
    if (!rent || !minRentPeriod || !tenant) return;

    if (
      [
        RentStatus.noPaidExtension,
        RentStatus.noPaidExtensionWithWarning,
      ].includes(rent.status)
    ) {
      // if user is paying debt and debt is resolved to today only
      if (tenant.debtResolveType === DebtResolveType.DebtOnly) {
        dispatch(setRentEndDate(endOfDay(new Date())));
        return;
      }
      // if user is paying debt and debt is resolved to min periods
      if (tenant.debtResolveType === DebtResolveType.MinPeriod) {
        const difference = differenceInDays(
          endOfDay(new Date()),
          new Date(rent.finishAt),
        );
        const minPeriodsAmount = Math.ceil(difference / minRentPeriod);
        dispatch(
          setRentEndDate(
            endOfDay(
              addDays(
                new Date(rent.finishAt),
                minPeriodsAmount * minRentPeriod,
              ),
            ),
          ),
        );
        return;
      }
    }

    const difference = endDate
      ? differenceInCalendarDays(endDate, startDate)
      : null;

    if (
      rentPaymentType === RentPaymentType.Installments &&
      minRentDaysForInstallments
    ) {
      if (difference && difference >= minRentDaysForInstallments) return;

      const newEnd = addDays(
        startOfDay(new Date(rent.finishAt)),
        minRentDaysForInstallments,
      );
      const newEndOrToday = isBefore(newEnd, new Date())
        ? startOfDay(addDays(new Date(), 1))
        : newEnd;
      dispatch(setRentEndDate(endOfDay(newEndOrToday)));
    } else {
      if (difference && difference >= minRentPeriod) return;
 
      const newEnd = addDays(
        startOfDay(new Date(rent.finishAt)),
        minRentPeriod,
      );
      const newEndOrToday = isBefore(newEnd, new Date())
        ? startOfDay(addDays(new Date(), 1))
        : newEnd;
      dispatch(setRentEndDate(endOfDay(newEndOrToday)));
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
    setLoading(true);
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

  const setMinDate = (addAmount = 0, end?: boolean) => {
    if (!rent) return;

    // IF rent has status noPaidExtension
    if (
      [
        RentStatus.noPaidExtension,
        RentStatus.noPaidExtensionWithWarning,
      ].includes(rent.status) &&
      tenant?.debtResolveType === DebtResolveType.DebtOnly
    )
      return endOfDay(new Date());

    const minDate = addDays(startOfDay(new Date(rent.finishAt)), addAmount);
    if (isBefore(minDate, new Date())) return startOfDay(new Date());
    return minDate;
  };

  const setMaxDateForEnd = (addAmount = 0) => {
    if (!rent) return;

    // IF rent has status noPaidExtension
    if (
      [
        RentStatus.noPaidExtension,
        RentStatus.noPaidExtensionWithWarning,
      ].includes(rent.status) &&
      tenant?.debtResolveType === DebtResolveType.DebtOnly
    )
      return endOfDay(addDays(new Date(), addAmount));

    return endOfDay(addDays(startDate, addAmount));
  };

  useEffect(() => {
    if (!user) return;
    clearPaymentDetails();
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
    if (
      !rent ||
      !endDate ||
      !startDate ||
      !minRentPeriod ||
      maxRentPeriod === null
    )
      return false;
    const difference = differenceInCalendarDays(endDate, startDate);

    if (
      [
        RentStatus.noPaidExtension,
        RentStatus.noPaidExtensionWithWarning,
      ].includes(rent.status)
    )
      return true;

    if (
      rentPaymentType === RentPaymentType.Installments &&
      minRentDaysForInstallments &&
      difference < minRentDaysForInstallments - 1
    )
      return false;

    if (difference >= minRentPeriod - 1) return true;
    if (difference <= maxRentPeriod) return true;
    return false;
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
                minDate={setMinDate(minRentPeriod, true)}
                maxDate={
                  maxRentPeriod
                    ? setMaxDateForEnd(maxRentPeriod - 1)
                    : undefined
                }
                highlightStart={startDate}
                highlightEnd={endDate}
                value={endDate || undefined}
                onChange={([selected]) => {
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
              <strong>{dateOnly(addDays(new Date(rent.finishAt), 1))}</strong> -{' '}
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
              size="large"
              to={`/${UserService.getSlugByRole(user.role)}/order/step/summary/${rentId}`}
              text="application.next"
              iconRight={<ArrowRight />}
              disabled={!correctPeriodSelected || !allRequiredAddonsSelected}
            />
          </ButtonsContainer>
        </Section>
      </Stack>
    </form>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  formData: state.order.formData,
  rent: state.rent.singleRent,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...order,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StepExtensionDuration);
