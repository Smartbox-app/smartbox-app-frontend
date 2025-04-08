import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect, useDispatch, useSelector } from 'react-redux';

import { addDays, isBefore, startOfDay } from 'date-fns';
import {
  AddonUserFileRequirementType,
  IStock,
  MyRentDetails,
  MyRentList,
  RentStatus,
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
  setOrderStock,
  setRentEndDate,
  setRentStartDate,
} from '../../../../../actions/order';
import { Addons } from '../Common/Addons';
import ApiService from '../../../../../services/api-service';
import { getColorForBackground } from '../../../../../utils/color';
import { PaymentType } from '../Common/PaymentType';
import { getMinRentPeriodExtendingForRent } from '../../../../../actions/single-rent';
import { darken, lighten } from 'polished';
import { useGetMyDetailsQuery } from 'src/queries';
import { Button, Section, Stack } from 'src/components/ui';
import { ArrowRight } from 'src/icons';

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
  const [rent, setRent] = useState<MyRentDetails>();
  const minRentPeriod = useSelector(
    (state: ApplicationState) => state.order.minRentPeriod,
  );
  // box groupId is used directly only when new rent is created
  const { startDate, endDate, loadingPrice, orderAddons, orderAddonsId } =
    useSelector((state: ApplicationState) => state.order);
  const [stock, setStock] = useState<IStock>();
  const [loading, setLoading] = useState<boolean>(false);

  const getStock = async () => {
    if (!rent) return;
    await ApiService.callFetch(
      'GET',
      `stock/${rent.stockId}`,
      (res: IStock) => {
        setStock(res);
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

    const newEnd = addDays(startOfDay(new Date(rent.finishAt)), minRentPeriod);
    const newEndOrToday = isBefore(newEnd, new Date()) ? startOfDay(addDays(new Date(), 1)) : newEnd;
    dispatch(
      setRentEndDate(newEndOrToday),
    );
  }, [minRentPeriod, rent]);

  useEffect(() => {
    if (!rentId || !endDate) return;
    console.log('GOT END DATE', endDate);
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
            addon.selectedVariant,
          ),
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
    console.log('ADDONS', orderAddons);
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
          console.log('1');
          return false;
        }
      }

      if (orderAddon.userFileAllowed) {
        if (
          orderAddon.userFileRequirement ===
            AddonUserFileRequirementType.Required &&
          !orderAddon.file
        ) {
          console.log('2');
          return false;
        }
      }
    }

    return true;
  }, [orderAddons]);

  if (!user) return null;

  if (!rent || !minRentPeriod) return <Spinner overlay />;

  return (
    <form className="form-step-two">
      <Stack>
        {loadingPrice && <Spinner halfTransparent overlay />}
        <Section>
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
        </Section>
        <Addons stockId={rent.stockId} />

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
              disabled={!allRequiredAddonsSelected}
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
