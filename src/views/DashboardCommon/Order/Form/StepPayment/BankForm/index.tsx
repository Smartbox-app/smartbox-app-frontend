import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ExecuteBlikPaymentReq, UserRes } from 'smartbox-types';
import { history } from '../../../../../../App';
import { Button } from '../../../../../../components/Common';
import { ButtonsContainer, FormHeader } from '../../../../../../components/Layout';
import { __ } from '../../../../../../helpers/i18n';
import { ApplicationState } from '../../../../../../reducers';
import { PaymentMethodDetail } from '../../../../../../reducers/order-reducer';
import UserService from '../../../../../../services/user-service';
import { modal, order } from '../../../../../../actions';

interface Props {
  bankGroup: PaymentMethodDetail;
  user: UserRes;
  paymentId: string;
  sentExecutePaymentWithTpayRequest: (paymentId: string, group: string) => void;
  showModal: (content: React.ReactNode, isClosable: boolean) => void;
}

const BankForm = ({ user, paymentId, sentExecutePaymentWithTpayRequest, bankGroup }: Props) => {
  useEffect(() => {
    sentExecutePaymentWithTpayRequest(paymentId, bankGroup.id);
  }, []);

  const { handleSubmit, register, errors, watch } = useForm();

  const onSubmit = (data: any) => {
    const req: ExecuteBlikPaymentReq = {
      paymentId,
      code: data.blikInput,
    };
  };

  const onBack = () => {
    history.push(`/${UserService.getSlugByRole(user.role)}/order/step/agreement`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-step-payment-blik">
      <h1>Płatność TPAYEM</h1>
    </form>
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
