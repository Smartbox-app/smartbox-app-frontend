import React, { useEffect, useMemo, useState } from "react";
import { useForm, Controller, FormContext } from "react-hook-form";
import { useParams } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect, useDispatch, useSelector } from "react-redux";

import {
  addDays,
  differenceInDays,
  endOfDay,
  startOfDay,
  startOfToday,
} from "date-fns";
import {
  AddonUserFileRequirementType,
  IStock,
  MyRentList,
  RentPaymentType,
  StockPaymentType,
  UserRes,
} from "smartbox-types";
import { DateInput } from "../../../../../components/Common";
import { Button, Spinner } from "../../../../../components/Branded";
import { order } from "../../../../../actions";
import { ButtonsContainer } from "../../../../../components/Layout";
import { FormType } from "../../../../../types/order-form";
import { ApplicationState } from "../../../../../reducers";
import UserService from "../../../../../services/user-service";

import Price from "../Common/Price";

import "./StepDuration.scss";

import styled from "styled-components";
import {
  calculateAddonPrice,
  calculatePrice,
  clearAddonPrice,
  setRentEndDate,
  setRentPaymentType,
  setRentStartDate,
} from "../../../../../actions/order";
import { Addons } from "../Common/Addons";
import { getColorForBackground } from "../../../../../utils/color";
import { PaymentType } from "../Common/PaymentType";
import ApiService from "../../../../../services/api-service";
import { darken, lighten } from "polished";

const StyledCalendarPicker = styled.div`
  margin: 0 -10px;
  .flatpickr-day {
    &.today {
      border-color: ${(props) => props.theme.colors.primary};
    }

    &.highlighted {
      background-color: #ccc;
      color: ${(props) => getColorForBackground("#ccc")};
    }

    &.selected {
      background-color: ${(props) => props.theme.colors.primary};
      color: ${(props) => getColorForBackground(props.theme.colors.primary)};
      border-color: ${(props) => darken(0.05, props.theme.colors.primary)};
    }
  }
`;

interface Props {
  history: any;
  formData: FormType;
  stockId: string;
  user: UserRes | null;
  rent: MyRentList;
  updateFormData: (data: Partial<FormType>) => void;
  clearPaymentDetails: () => void;
}

const StepDuration = ({ clearPaymentDetails, user }: Props) => {
  const dispatch = useDispatch();
  const minRentPeriod = useSelector(
    (state: ApplicationState) => state.order.minRentPeriod
  );
  // box groupId is used directly only when new rent is created
  const boxGroupId = useSelector(
    (state: ApplicationState) => state.order.boxGroupId
  );
  const {
    stockId,
    startDate,
    endDate,
    loadingPrice,
    orderAddons,
    orderAddonsId,
    calculatedPrice,
    rentPaymentType,
  } = useSelector((state: ApplicationState) => state.order);
  const [stock, setStock] = useState<IStock>();
  const [loading, setLoading] = useState<boolean>(false);

  const getStock = async () => {
    await ApiService.callFetch("GET", `stock/${stockId}`, (res: IStock) => {
      setStock(res);
    });
  };

  useEffect(() => {
    if (!minRentPeriod) return;
    if (!endDate) {
      dispatch(setRentEndDate(addDays(startDate, minRentPeriod - 1)));
      return;
    }
    setLoading(true);
    getStock();

    const startOfStart = startOfDay(startDate);
    const endOfEnd = endOfDay(endDate);

    dispatch(calculatePrice(boxGroupId, startOfStart, endOfEnd));

    calculateAllAddons();
  }, [startDate, endDate, minRentPeriod]);

  useEffect(() => {
    calculateAllAddons();
  }, [orderAddonsId]);

  useEffect(() => {
    if (!stock || rentPaymentType) return;

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
            addon.selectedVariant
          )
        );
      else dispatch(clearAddonPrice(addonId));
    });
  };

  const setMinDate = (addAmount = 0, end?: boolean) =>
    addDays(end ? startDate : startOfToday(), addAmount);

  const setMaxDateToExtend = () => addDays(new Date(), 6);

  const defaultValues = {
    dateStart: addDays(startDate, 0),
    dateEnd: addDays(startDate, 1),
  };

  useEffect(() => {
    if (!user) return;
    clearPaymentDetails();
  }, []);

  const { register, reset, control } = useForm({ defaultValues });

  useEffect(() => {
    if (!minRentPeriod) return;

    reset({
      dateStart: addDays(startDate, 0),
      dateEnd: addDays(startDate, minRentPeriod - 1),
    });
  }, [minRentPeriod]);

  useEffect(() => {
    if (!endDate) return;

    reset({
      dateEnd: endDate,
    });
  }, [endDate]);

  useEffect(() => {
    if (!startDate) return;

    reset({
      dateStart: startDate,
    });
  }, [startDate]);

  const methods = useForm();

  const allRequiredAddonsSelected = useMemo(() => {
    const addonIds = Object.keys(orderAddons);

    console.log("ADDONS", orderAddons);
    for (let addonId of addonIds) {
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

      for (let acceptance of orderAddon.acceptances) {
        if (
          orderAddon.selectedVariant &&
          acceptance &&
          acceptance.required &&
          !orderAddon.acceptancesStatus[acceptance.id].accepted
        ) {
          console.log("1");
          return false;
        }
      }

      if (orderAddon.userFileAllowed) {
        if (
          orderAddon.userFileRequirement ===
            AddonUserFileRequirementType.Required &&
          !orderAddon.file
        ) {
          console.log("2");
          return false;
        }
        // if (
        //   orderAddon.userFileRequirement ===
        //     AddonUserFileRequirementType.RequiredWhenNoVariant &&
        //   orderAddon.selectedVariant &&
        //   !orderAddon.file
        // ) {
        //   console.log("3");
        //   return false;
        // }
      }
    }

    return true;
  }, [orderAddons]);

  if (!user || !minRentPeriod) return null;

  return (
    <FormContext {...methods}>
      <form className="form-step-two">
        {loadingPrice && <Spinner halfTransparent overlay />}
        <StyledCalendarPicker className="calendars-picker-wrapper">
          <Controller
            name="dateStart"
            control={control}
            as={DateInput}
            highlightStart={startDate}
            highlightEnd={endDate}
            register={register({ required: true })}
            label="application.selectStartRentDate"
            minDate={setMinDate()}
            maxDate={setMaxDateToExtend()}
            onChange={([selected]) => {
              dispatch(setRentStartDate(selected[0]));
            }}
          />
          <Controller
            name="dateEnd"
            control={control}
            as={DateInput}
            highlightStart={startDate}
            highlightEnd={endDate}
            register={register({ required: true })}
            label="application.selectEndRentDate"
            minDate={setMinDate(minRentPeriod - 1, true)}
            onChange={([selected]) => {
              dispatch(setRentEndDate(selected[0]));
            }}
          />
        </StyledCalendarPicker>

        <Addons stockId={stockId} />

        {stock ? <PaymentType stock={stock} /> : null}
        <Price />
        <ButtonsContainer max>
          <Button
            outline
            text="application.back"
            to={`/${UserService.getSlugByRole(user.role)}/order/step/stock`}
          />
          <Button
            to={`/${UserService.getSlugByRole(user.role)}/order/step/summary`}
            primary
            text="application.next"
            disabled={
              !allRequiredAddonsSelected ||
              !stock ||
              !endDate ||
              !calculatedPrice.value
            }
          />
        </ButtonsContainer>
      </form>
    </FormContext>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  formData: state.order.formData,
  user: state.user.details,
  rent: state.rent.singleRent,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...order,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(StepDuration);
