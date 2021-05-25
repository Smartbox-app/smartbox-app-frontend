import { addDays, differenceInCalendarDays } from 'date-fns';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { MyRentList } from 'smartbox-types';
import { singleRent } from '../../../../actions';
import { Button } from '../../../../components/Common';
import { ButtonsContainer } from '../../../../components/Layout';
import { ApplicationState } from '../../../../reducers';

import './MissingPaymentAlert.scss';
import { dateOnly } from '../../../../utils/format-date';
import { formatPrice } from '../../../../utils/format-price';

interface Props {
  singleRent: MyRentList;
}

const countMissingPayment = (singleRent: MyRentList): number => {
  return 1200;
};

const MissingPaymentAlert = ({ singleRent }: Props) => {
  console.log('asd');

  return (
    <div className="missing-payment-alert-wrapper">
      <p className="main-info">Na tym wynajmie znajduje się zaległość</p>
      <div className="date-wrapper">
        <p className="single-line">
          zakończenie wynajmu: <strong>{dateOnly(singleRent.finishAt)}</strong>
        </p>
        <p className="single-line">
          zaległych okresów płatności:{' '}
          <strong>
            {Math.ceil(differenceInCalendarDays(addDays(new Date(), 1), new Date(singleRent.finishAt)) / 7)}
          </strong>
        </p>
      </div>
      <div className="date-wrapper">
        <p className="single-line">
          kwota zaległości: <strong>{formatPrice(countMissingPayment(singleRent))}</strong>
        </p>
      </div>
      <ButtonsContainer>
        <Button text="Opłać zaległość" type="button" danger />
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

export default connect(mapStateToProps, mapDispatchToProps)(MissingPaymentAlert);
