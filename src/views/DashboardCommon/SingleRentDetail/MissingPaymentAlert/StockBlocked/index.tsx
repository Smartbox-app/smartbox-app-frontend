import React from 'react';
import {__} from "../../../../../helpers/i18n";

const StockBlocked = () => (
  <div className="missing-payment-alert-wrapper">
    <p className="main-info">
        {__('application.boxWasBlockedDueNoPayment')}
    </p>
  </div>
);

export default StockBlocked;
