import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { PaymentType, UserRes } from 'smartbox-types';
import { order, paymentStatus } from '../../../../../actions';
import UserService from '../../../../../services/user-service';
import { FormType } from '../../../../../types/order-form';
import { ApplicationState } from '../../../../../reducers';
import { history } from '../../../../../App';

import BankForm from './BankForm';
import CreditCardForm from './CreditCardForm';
import BlikForm from './BlikForm';

import './StepPayment.scss';

interface Props {
  user: UserRes;
  formData: FormType;
  selectedPayment: PaymentType;
  resetPaymentForm: () => void;
}

const formToRender = (selectedPayment) => {
  switch (selectedPayment) {
    case PaymentType.card:
      return <CreditCardForm />;
    case PaymentType.blik:
      return <BankForm />; //TODO ?? Blik form gets strange error
    case PaymentType.transfer:
      return <BankForm />;
    default:
      return <CreditCardForm />;
  }
};

const StepPayment = ({ formData, selectedPayment, user, resetPaymentForm }: Props) => {
  useEffect(() => {
    if (formData.size.length === 0) {
      history.push(`/${UserService.getSlugByRole(user.role)}/order/step/size`);
    }

    return () => {
      resetPaymentForm();
    };
  }, []);

  return <>{formToRender(selectedPayment)}</>;
};

const mapStateToProps = (state: ApplicationState) => ({
  formData: state.order.formData,
  selectedPayment: state.order.selectedPayment,
  user: state.user.details,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...order,
      ...paymentStatus,
    },
    dispatch,
  );

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(StepPayment));
