import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ApplicationState } from '../../../../../reducers';

interface Props {}

const StockBlocked = ({}: Props) => {
  console.log('StockBlocked');
  return (
    <div className="missing-payment-alert-wrapper">
      <p className="main-info">
        Twój schowek został zablokowany, ze względu na brak płatności, prosimy o kontakt z administratorem.
      </p>
    </div>
  );
};

const mapStateToProps = (state: ApplicationState) => ({});

const mapDispatchToProps = (dispatch: any) => bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(StockBlocked);
