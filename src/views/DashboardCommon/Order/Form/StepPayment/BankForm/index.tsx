import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { UserRes } from 'smartbox-types';
import { PageHeader } from '../../../../../../components/Layout';
import { ApplicationState } from '../../../../../../reducers';
import { PaymentMethodDetail } from '../../../../../../reducers/order-reducer';
import { modal, order } from '../../../../../../actions';

import './BankForm.scss';
import { Spinner } from '../../../../../../components/Common';

interface RouteProps {
  step: string;
  rentId: string;
}

interface Props extends RouteComponentProps<RouteProps> {
  bankGroup: PaymentMethodDetail;
  user: UserRes;
  paymentId: string;
  sentExecutePaymentWithTpayRequest: (paymentId: string, group: string) => void;
  func: any;
  loading: boolean;
}

const BankForm = ({ func, paymentId, sentExecutePaymentWithTpayRequest, bankGroup, loading }: Props) => {
  useEffect(() => {
    sentExecutePaymentWithTpayRequest(paymentId, bankGroup.id);
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
  user: state.user.details,
  bankGroup: state.order.selectedPaymentMethodDetail,
  func: state.paymentStatus.func,
  loading: state.spinner.loading,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...order,
      ...modal,
    },
    dispatch,
  );

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BankForm));
