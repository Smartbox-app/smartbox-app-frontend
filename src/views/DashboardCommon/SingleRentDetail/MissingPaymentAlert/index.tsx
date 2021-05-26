import React from 'react';
import { connect } from 'react-redux';
import { MyRentList, RentStatus } from 'smartbox-types';
import { ApplicationState } from '../../../../reducers';
import MissingPayment from './MissingPayment';
import StockBlocked from './StockBlocked';

import './MissingPaymentAlert.scss';

interface Props {
  singleRent: MyRentList;
}

const MissingPaymentAlert = ({ singleRent }: Props) => {
  if (singleRent.status === RentStatus.noPaidExtension) {
    return <MissingPayment />;
  } else if (singleRent.status === RentStatus.noPaidExtensionWithWarning) {
    return <StockBlocked />;
  } else {
    return null;
  }
};

const mapStateToProps = (state: ApplicationState) => ({
  singleRent: state.rent.singleRent,
});

export default connect(mapStateToProps)(MissingPaymentAlert);
