import { addDays, differenceInCalendarDays } from 'date-fns';
import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { MyRentList, usePricing } from 'smartbox-types';
import { singleRent } from '../../../../../actions';
import { Button } from '../../../../../components/Common';
import { ButtonsContainer } from '../../../../../components/Layout';
import { ApplicationState } from '../../../../../reducers';
import { dateOnly } from '../../../../../utils/format-date';
import { formatPrice } from '../../../../../utils/format-price';

interface Props {
  singleRent: MyRentList;
}

const MissingPayment = ({ singleRent }: Props) => {
  const { pricing } = usePricing();

  const countPayPeriods = useCallback(
    (date: Date) => Math.ceil(differenceInCalendarDays(new Date(), new Date(date)) / 7),
    [],
  );

  const calc = useCallback((singleRent: MyRentList): number => {
    const { weekly } = pricing[singleRent.size || 3];
    return weekly * countPayPeriods(singleRent.finishAt);
  }, []);

  return (
    <div className="missing-payment-alert-wrapper">
      <p className="main-info">Na tym wynajmie znajduje się zaległość</p>
      <div className="date-wrapper">
        <p className="single-line">
          Zakończenie wynajmu: <strong>{dateOnly(singleRent.finishAt)}</strong>
        </p>
        <p className="single-line">
          Zaległych okresów płatności: <strong>{countPayPeriods(singleRent.finishAt)}</strong>
        </p>
      </div>
      <div className="date-wrapper">
        <p className="single-line">
          Termin płatności: <strong>{dateOnly(addDays(new Date(singleRent.finishAt), 13))}</strong>
        </p>
        <p className="single-line">
          Kwota zaległości: <strong>{formatPrice(calc(singleRent))}</strong>
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

export default connect(mapStateToProps, mapDispatchToProps)(MissingPayment);
