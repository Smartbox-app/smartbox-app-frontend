import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { Spinner } from '../../../../../../components/Branded';
import { ApplicationState } from '../../../../../../reducers';
import { modal, order } from '../../../../../../actions';

interface RouteProps {
  step: string;
  rentId: string;
}

interface Props extends RouteComponentProps<RouteProps> {
  paymentId: string;
  func: any;
  loading: boolean;
  sentExecutePaymentWithTpayRequest: (paymentId: string) => void;
}

const BlikForm = ({ paymentId, sentExecutePaymentWithTpayRequest, loading, func }: Props) => {
  useEffect(() => {
    sentExecutePaymentWithTpayRequest(paymentId);
  }, []);

  return (
    <div className="form-step-payment-blik">
      {loading ? (
        <Spinner />
      ) : (
        <div className="bank-input-wrapper">
          <div dangerouslySetInnerHTML={{ __html: func || '' }} />
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  paymentId: state.order.paymentId,
  loading: state.spinner.loading,
  func: state.paymentStatus.func,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...order,
      ...modal,
    },
    dispatch,
  );

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BlikForm));
