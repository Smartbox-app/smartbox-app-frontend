import React, { useEffect, useMemo, useState } from 'react';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect, useDispatch, useSelector } from 'react-redux';

import {
  addDays,
  differenceInCalendarDays,
  differenceInDays,
  endOfDay,
  startOfDay,
  startOfToday,
} from 'date-fns';
import {
  AddonUserFileRequirementType,
  MyRentList,
  RentPaymentType,
  StockPaymentType,
  StockRes,
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
  calculatePrice,
  clearAddonPrice,
  setMinDaysForInstallments,
  setOrderFullStock,
  setRentEndDate,
  setRentPaymentType,
  setRentStartDate,
} from '../../../../../actions/order';
import { Addons } from '../Common/Addons';
import { PaymentType } from '../Common/PaymentType';
import ApiService from '../../../../../services/api-service';
import { useGetMyDetailsQuery } from 'src/queries';
import { Button, Section, Stack } from 'src/components/ui';
import { ArrowLeft, ArrowRight } from 'src/icons';
import { RentDurationDto } from 'src/dto/RentDurationDto';
import { ClassValidatorResolver } from 'src/resolvers/ClassValidatorResolver';
import { RentDuration } from '../Common/RentDuration';

const StyledCalendarPicker = styled.div`
  justify-content: center;
  gap: 20px;
`;

interface Props {
  history: any;
  formData: FormType;
  stockId: string;
  rent: MyRentList;
  updateFormData: (data: Partial<FormType>) => void;
  clearPaymentDetails: () => void;
}

const StepDuration = ({ clearPaymentDetails }: Props) => {
  const { data: user } = useGetMyDetailsQuery();
  const dispatch = useDispatch();
  const minRentPeriod = useSelector(
    (state: ApplicationState) => state.order.minRentPeriod,
  );
  const maxRentPeriod = useSelector(
    (state: ApplicationState) => state.order.maxRentPeriod,
  );
  // box groupId is used directly only when new rent is created
  const boxGroupId = useSelector(
    (state: ApplicationState) => state.order.boxGroupId,
  );
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
    minRentDaysForInstallments,
  } = useSelector((state: ApplicationState) => state.order);
  const [loading, setLoading] = useState<boolean>(false);

  const getStock = async () => {
    await ApiService.callFetch('GET', `stock/${stockId}`, (res: StockRes) => {
      dispatch(setOrderFullStock(res));
    });
  };

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
    if (!minRentPeriod) return;
    if (!endDate) {
      setRentEndDateAccordingToType(
        startDate,
        rentPaymentType,
        minRentPeriod,
        minRentDaysForInstallments,
      );
      return;
    }
    setLoading(true);
    getStock();

    const startOfStart = startOfDay(startDate);
    const endOfEnd = endOfDay(endDate);

    const difference = differenceInDays(endOfEnd, startOfStart);

    if (
      rentPaymentType === RentPaymentType.Installments &&
      !!minRentDaysForInstallments
    ) {
      if (difference < minRentDaysForInstallments - 1) {
        dispatch(
          setRentEndDate(
            endOfDay(addDays(startDate, minRentDaysForInstallments - 1)),
          ),
        );
        return;
      }
    } else {
      if (difference < minRentPeriod - 1) {
        dispatch(
          setRentEndDate(endOfDay(addDays(startDate, minRentPeriod - 1))),
        );
        return;
      }
    }

    if (maxRentPeriod && difference > maxRentPeriod - 1) {
      dispatch(setRentEndDate(endOfDay(addDays(startDate, maxRentPeriod - 1))));
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
  ]);

  useEffect(() => {
    calculateAllAddons();
  }, [orderAddonsId]);

  useEffect(() => {
    if (!stock || rentPaymentType) return;

    dispatch(setMinDaysForInstallments(stock.minRentDaysForInstallments));

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
  }, [stock]);

  const calculateAllAddons = () => {
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

  const setMinDate = (addAmount = 0, end?: boolean) =>
    addDays(end ? startDate : startOfToday(), addAmount);

  const setMaxDateForEnd = (addAmount = 0) =>
    endOfDay(addDays(startDate, addAmount));

  // people should be able to start rent two weeks before
  const setMaxDateForStart = () => addDays(new Date(), 13);

  const defaultValues = {
    startDate: addDays(startDate, 0),
    endDate: addDays(startDate, 1),
  };

  useEffect(() => {
    if (!user) return;
    clearPaymentDetails();
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
    if (!endDate || !startDate || !minRentPeriod || maxRentPeriod === null)
      return false;
    const difference = differenceInCalendarDays(endDate, startDate);

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
    startDate,
    endDate,
    minRentPeriod,
    maxRentPeriod,
    rentPaymentType,
    minRentDaysForInstallments,
  ]);

  if (!user || !minRentPeriod || maxRentPeriod === null) return null;

  return (
    <form className="form-step-two">
      <Stack>
        <Section>
          {loadingPrice && <Spinner halfTransparent overlay />}
          <StyledCalendarPicker className="calendars-picker-wrapper">
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <DateInput
                  {...field}
                  value={startDate!}
                  name="startDate"
                  highlightStart={startDate}
                  highlightEnd={endDate}
                  label="application.selectStartRentDate"
                  minDate={setMinDate()}
                  maxDate={setMaxDateForStart()}
                  onChange={([selected]) => {
                    dispatch(setRentStartDate(selected));
                  }}
                />
              )}
            />
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
                  onChange={([selected]) => {
                    dispatch(setRentEndDate(selected));
                  }}
                />
              )}
            />
          </StyledCalendarPicker>
          <RentDuration />
        </Section>

        {stock ? <PaymentType stock={stock} /> : null}
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
              to={`/${UserService.getSlugByRole(user.role)}/order/step/summary`}
              size="large"
              text="application.next"
              iconRight={<ArrowRight />}
              disabled={
                !correctPeriodSelected ||
                !allRequiredAddonsSelected ||
                !stock ||
                !endDate ||
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

export default connect(mapStateToProps, mapDispatchToProps)(StepDuration);
