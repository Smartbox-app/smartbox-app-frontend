import { addDays, differenceInCalendarDays, differenceInDays } from 'date-fns';
import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { MyRentList, usePricing, UserRes } from 'smartbox-types';
import { singleRent } from '../../../../../actions';
import { Button } from '../../../../../components/Common';
import { ButtonsContainer } from '../../../../../components/Layout';
import { ApplicationState } from '../../../../../reducers';
import UserService from '../../../../../services/user-service';
import { dateOnly } from '../../../../../utils/format-date';
import { formatPrice } from '../../../../../utils/format-price';
import { __ } from '../../../../../helpers/i18n';

interface Props {
  singleRent: MyRentList;
  user: UserRes;
}

const MissingPayment = ({ singleRent, user }: Props) => {
  const { pricing } = usePricing();

  const countPayPeriods = useCallback(
    (date: Date) => Math.ceil(differenceInCalendarDays(new Date(), new Date(date)) / 7),
    [],
  );

  // const calc = useCallback((singleRent: MyRentList): number => {
  //   const { weekly } = pricing[singleRent.size || 3];
  //   return weekly * countPayPeriods(singleRent.finishAt);
  // }, []);

  const calc = (singleRent: MyRentList) => {
    const fullWeeks = Math.ceil(differenceInDays(new Date(), new Date(singleRent.finishAt)) / 7);
    const cost = Math.max(1, Math.min(2, fullWeeks)) * pricing[singleRent.size || 3].weekly; // 100 - 200 PLN
    return cost;
  };

  return (
    <div className="missing-payment-alert-wrapper">
      <p className="main-info">{__('application.debtOnRent')}</p>
      <div className="date-wrapper">
        <p className="single-line">
          {__('application.rentFinished')} <strong>{dateOnly(singleRent.finishAt)}</strong>
        </p>
        <p className="single-line">
          {__('application.debtPeriods')} <strong>{countPayPeriods(singleRent.finishAt)}</strong>
        </p>
      </div>
      <div className="date-wrapper">
        <p className="single-line">
          {__('application.paymentTerm')} <strong>{dateOnly(addDays(new Date(singleRent.finishAt), 13))}</strong>
        </p>
        <p className="single-line">
          {__('application.debtAmount')} <strong>{formatPrice(calc(singleRent))}</strong>
        </p>
      </div>
      <ButtonsContainer>
        <Button
          text="application.payOffDebt"
          type="button"
          danger
          to={`/${UserService.getSlugByRole(user.role)}/pay-debt/${singleRent.id}`}
        />
      </ButtonsContainer>
    </div>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  singleRent: state.rent.singleRent,
  user: state.user.details,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...singleRent,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(MissingPayment);
