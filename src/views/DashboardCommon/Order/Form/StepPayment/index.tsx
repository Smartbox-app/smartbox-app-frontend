import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { PaymentType, UserRes } from 'smartbox-types';
import { order } from '../../../../../actions';
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
}

const StepPayment = ({ formData, selectedPayment, user }: Props) => {
  useEffect(() => {
    if (formData.size.length === 0) {
      history.push(`/${UserService.getSlugByRole(user.role)}/order/step/size`);
    }
  });

  const formToRender = () => {
    switch (selectedPayment) {
      case PaymentType.card:
        return <CreditCardForm />;
      case PaymentType.blik:
        return <BlikForm />;
      case PaymentType.transfer:
        return <BankForm />;
      default:
        return <CreditCardForm />;
    }
  };

  return <>{formToRender()}</>;
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
    },
    dispatch,
  );

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(StepPayment));
