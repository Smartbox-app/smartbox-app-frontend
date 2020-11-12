import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { UserRes } from 'smartbox-types';
import { Spinner } from '../../../../../../components/Common';
import { PageHeader } from '../../../../../../components/Layout';
import { ApplicationState } from '../../../../../../reducers';
import { PaymentMethodDetail } from '../../../../../../reducers/order-reducer';
import { modal, order } from '../../../../../../actions';

interface RouteProps {
  step: string;
  rentId: string;
}

interface Props extends RouteComponentProps<RouteProps> {
  bankGroup: PaymentMethodDetail;
  user: UserRes;
  paymentId: string;
  sentExecutePaymentWithTpayRequest: (paymentId: string, group: string) => void;
}

const BankForm = ({ user, paymentId, sentExecutePaymentWithTpayRequest, bankGroup }: Props) => {
  useEffect(() => {
    sentExecutePaymentWithTpayRequest(paymentId, bankGroup.id);
  }, []);

  return (
    <div className="form-step-payment-blik">
      <PageHeader title="Za chwilę zostaniesz przekierowany na stronę banku" />
      <Spinner />
    </div>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  paymentId: state.order.paymentId,
  user: state.user.details,
  bankGroup: state.order.selectedPaymentMethodDetail,
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
