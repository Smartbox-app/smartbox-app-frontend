import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { UserRes } from 'smartbox-types';
import { Spinner } from '../../../../../../components/Common';
import { PageHeader } from '../../../../../../components/Layout';
import { ApplicationState } from '../../../../../../reducers';
import { PaymentMethodDetail } from '../../../../../../reducers/order-reducer';
import { modal, order } from '../../../../../../actions';

interface Props {
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
      <PageHeader title="Za chwilę zostaniesz przekerowany na stronę banku" />
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

export default connect(mapStateToProps, mapDispatchToProps)(BankForm);
