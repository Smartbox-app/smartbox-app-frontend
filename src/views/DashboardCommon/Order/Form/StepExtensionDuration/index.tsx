import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect, useDispatch, useSelector } from "react-redux";

import { addDays, isBefore, startOfDay } from "date-fns";
import {
  IStock,
  MyRentDetails,
  MyRentList,
  RentStatus,
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
  calculatePriceForRent,
  clearAddonPrice,
  setOrderStock,
  setRentEndDate,
  setRentStartDate,
} from "../../../../../actions/order";
import { Addons } from "../Common/Addons";
import ApiService from "../../../../../services/api-service";
import { getColorForBackground } from "../../../../../utils/color";
import { PaymentType } from "../Common/PaymentType";
import { getMinRentPeriodExtendingForRent } from "../../../../../actions/single-rent";
import { darken, lighten } from "polished";

const StyledCalendarPicker = styled.div`
  margin: 0 -10px;
  .flatpickr-day {
    &.today {
      border-color: ${(props) => props.theme.colors.primary};
    }

    &.highlighted {
      background-color: ${(props) => lighten(0.1, props.theme.colors.primary)};
      color: ${(props) =>
        getColorForBackground(lighten(0.1, props.theme.colors.primary))};
    }

    &.selected {
      background-color: ${(props) => props.theme.colors.secondary};
      color: ${(props) => getColorForBackground(props.theme.colors.secondary)};
         border-color: ${(props) => darken(0.05, props.theme.colors.secondary)};
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

const StepExtensionDuration = ({ clearPaymentDetails, user }: Props) => {
  const dispatch = useDispatch();
  const { rentId, step } = useParams<{ step: string; rentId?: string }>();
  const [rent, setRent] = useState<MyRentDetails>();
  const minRentPeriod = useSelector(
    (state: ApplicationState) => state.order.minRentPeriod
  );
  // box groupId is used directly only when new rent is created
  const { startDate, endDate, loadingPrice, orderAddons, orderAddonsId } =
    useSelector((state: ApplicationState) => state.order);
  const [stock, setStock] = useState<IStock>();
  const [loading, setLoading] = useState<boolean>(false);

  const getStock = async () => {
    if (!rent) return;
    await ApiService.callFetch(
      "GET",
      `stock/${rent.stockId}`,
      (res: IStock) => {
        setStock(res);
      }
    );
  };

  // get rent details if it is extended
  const getSingleRent = async () => {
    setLoading(true);
    await ApiService.callFetch(
      "GET",
      `rent/my-details/${rentId}`,
      (data: MyRentDetails) => {
        setRent(data);
      }
    );
    setLoading(false);
  };

  useEffect(() => {
    if (!rentId) return;

    dispatch(getMinRentPeriodExtendingForRent(rentId));
    getSingleRent();
  }, [rentId]);

  useEffect(() => {
    if (!rent) return;
    getStock();
    dispatch(setRentStartDate(addDays(startOfDay(new Date(rent.finishAt)), 1)));

    dispatch(setOrderStock(rent.stockId, rent.stockName, rent.stockAddress));
  }, [rent]);

  useEffect(() => {
    if (!rent || !minRentPeriod) return;
    dispatch(
      setRentEndDate(
        addDays(startOfDay(new Date(rent.finishAt)), minRentPeriod)
      )
    );
  }, [minRentPeriod, rent]);

  useEffect(() => {
    if (!rentId || !endDate) return;
    setLoading(true);
    dispatch(calculatePriceForRent(rentId, startDate, endDate));
    calculateAllAddons();
  }, [startDate, endDate, rentId]);

  useEffect(() => {
    calculateAllAddons();
  }, [orderAddonsId]);

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

  const setMinDate = (addAmount = 0, end?: boolean) => {
    if (!rent) return;

    // IF rent has status noPaidExtension
    if (rent.status === RentStatus.noPaidExtension)
      return startOfDay(new Date());

    const minDate = addDays(startOfDay(new Date(rent.finishAt)), addAmount);
    if (isBefore(minDate, new Date())) return startOfDay(new Date());
    return minDate;
  };

  useEffect(() => {
    if (!user) return;
    clearPaymentDetails();
  }, []);

  const allRequiredAddonsSelected = useMemo(() => {
    const addonIds = Object.keys(orderAddons);

    for (let addonId of addonIds) {
      const orderAddon = orderAddons[addonId];
      if (orderAddon.required && !orderAddon.selectedVariant) return false;

      for (let acceptance of orderAddon.acceptances) {
        if (
          orderAddon.selectedVariant &&
          acceptance &&
          acceptance.required &&
          !orderAddon.acceptancesStatus[acceptance.id].accepted
        )
          return false;
      }
    }

    return true;
  }, [orderAddons]);

  if (!user) return null;

  if (!rent || !minRentPeriod) return <Spinner overlay />;

  return (
    <form className="form-step-two">
      {loadingPrice && <Spinner halfTransparent overlay />}
      <StyledCalendarPicker className="calendars-picker-wrapper">
        <DateInput
          name="endDate"
          label="application.selectEndRentDate"
          minDate={setMinDate(minRentPeriod, true)}
          highlightStart={startDate}
          highlightEnd={endDate}
          value={endDate || undefined}
          onChange={([selected]) => {
            dispatch(setRentEndDate(selected));
          }}
        />
      </StyledCalendarPicker>

      <Addons stockId={rent.stockId} />

      {stock ? <PaymentType stock={stock} rent={rent} /> : null}
      <Price />
      <ButtonsContainer max>
        <Button
          to={`/${UserService.getSlugByRole(user.role)}/order/step/summary/${rentId}`}
          primary
          text="application.next"
          disabled={!allRequiredAddonsSelected}
        />
      </ButtonsContainer>
    </form>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StepExtensionDuration);
