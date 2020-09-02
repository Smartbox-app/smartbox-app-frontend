import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { UserRes } from 'smartbox-types';
import { order } from '../../../../../actions';
import { MainPaymentWay } from '../../../../../reducers/order-reducer';
import UserService from '../../../../../services/user-service';
import { FormType } from '../../../../../types/order-form';
import { ApplicationState } from '../../../../../reducers';
import { __ } from '../../../../../helpers/i18n';
import { history } from '../../../../../App';
import CreditCardForm from './CreditCardForm';
import BlikForm from './BlikForm';

import './StepPayment.scss';

interface Props {
  user: UserRes;
  formData: FormType;
  selectedPayment: MainPaymentWay;
}

const StepPayment = ({ formData, selectedPayment, user }: Props) => {
  useEffect(() => {
    if (formData.size.length === 0) {
      // history.push(`/${UserService.getSlugByRole(user.role)}/order/step/size`);
    }
  });

  const formToRender = () => {
    switch (selectedPayment) {
      case MainPaymentWay.card:
        return <CreditCardForm />;
      case MainPaymentWay.blik:
        return <BlikForm />;
      case MainPaymentWay.other:
        return <CreditCardForm />;
      default:
        return <BlikForm />;
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
