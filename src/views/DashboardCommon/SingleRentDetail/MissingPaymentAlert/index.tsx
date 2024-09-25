import React from 'react';
import { connect } from 'react-redux';
import { MyRentDetails, MyRentList, RentStatus } from 'smartbox-types';
import { ApplicationState } from '../../../../reducers';
import MissingPayment from './MissingPayment';
import StockBlocked from './StockBlocked';

import './MissingPaymentAlert.scss';

interface Props {
  rent: MyRentDetails;
}

export const MissingPaymentAlert = ({ rent }: Props) => {
  if (rent.status === RentStatus.noPaidExtension) {
    return <MissingPayment rent={rent} />;
  } else if (rent.status === RentStatus.noPaidExtensionWithWarning) {
    return <StockBlocked />;
  } else {
    return null;
  }
};