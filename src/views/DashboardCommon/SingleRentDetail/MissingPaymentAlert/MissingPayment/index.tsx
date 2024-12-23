import { addDays, differenceInCalendarDays, differenceInDays } from 'date-fns';
import React, { useCallback } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { MyRentDetails, MyRentList, } from 'smartbox-types';
import { singleRent } from '../../../../../actions';
import { Button } from '../../../../../components/Branded';
import { ButtonsContainer } from '../../../../../components/Layout';
import { ApplicationState } from '../../../../../reducers';
import UserService from '../../../../../services/user-service';
import { dateOnly } from '../../../../../utils/format-date';
import { formatPrice } from '../../../../../utils/format-price';
import { __ } from '../../../../../helpers/i18n';
import { clearOrder, updateFormData } from '../../../../../actions/order';
import { history } from '../../../../../App';

interface Props {
  rent: MyRentDetails;
}

// @TODO HANDLE
const MissingPayment = ({ rent }: Props) => {
  // const { pricing } = usePricing();
  const user = useSelector((state: ApplicationState) => state.user.details!);
  const dispatch = useDispatch();

  // const countPayPeriods = useCallback(
  //   (date: Date) => Math.ceil(differenceInCalendarDays(new Date(), new Date(date)) / 7),
  //   [],
  // );

  // const calc = useCallback((singleRent: MyRentList): number => {
  //   const { weekly } = pricing[singleRent.size || 3];
  //   return weekly * countPayPeriods(singleRent.finishAt);
  // }, []);

  // const calc = (singleRent: MyRentList) => {
  //   return 0;
  //   // const fullWeeks = Math.ceil(differenceInDays(new Date(), new Date(singleRent.finishAt)) / 7);
  //   // const cost = Math.max(1, Math.min(2, fullWeeks)) * pricing[singleRent.size || 3].weekly; // 100 - 200 PLN
  //   // return cost;
  // };

  const handleDebtPayOff = (rentId: string) => {
    dispatch(clearOrder());
    dispatch(updateFormData({ size: rent.size.toString(), stock: rent.stockId }));
    history.push(`/${UserService.getSlugByRole(user.role)}/order/step/duration/${rentId}`);
  };

  return (
    <div className="missing-payment-alert-wrapper">
      <p className="main-info">{__('application.debtOnRent')}</p>
      <div className="date-wrapper">
        <p className="single-line">
          {__('application.rentFinished')} <strong>{dateOnly(rent.finishAt)}</strong>
        </p>
      </div>
      <ButtonsContainer>
        <Button
          text="application.payOffDebt"
          type="button"
          danger
          click={() => handleDebtPayOff(rent.id)}
        />
      </ButtonsContainer>
    </div>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  singleRent: state.rent.singleRent,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...singleRent,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(MissingPayment);
