import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { withRouter } from 'react-router-dom';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ExecutePaymentReq, UserRes, IPricingResult } from 'smartbox-types';
import { Button } from '../../../../../components/Common';
import { order } from '../../../../../actions';
import { ButtonsContainer } from '../../../../../components/Layout';
import { history } from '../../../../../App';
import { FormType } from '../../../../../types/order-form';
import FormHeader from '../../../../../components/Layout/FormHeader';
import UserService from '../../../../../services/user-service';
import CreditCardInput from '../../../../../components/Common/CreditCardInput';
import { ApplicationState } from '../../../../../reducers';
import { __ } from '../../../../../helpers/i18n';

import './StepPayment.scss';

interface Props {
  history: any;
  formData: FormType;
  countedPrice: IPricingResult;
  paymentId: string;
  user: UserRes;
  sentExecutePaymentRequest: (data: ExecutePaymentReq) => void;
}

const StepPayment = ({ formData, user, sentExecutePaymentRequest, paymentId }: Props) => {
  useEffect(() => {
    if (formData.size.length === 0) {
      // history.push(`/${UserService.getSlugByRole(user.role)}/order/step/size`);
    }
  });
  const defaultValues = {
    cardNumber: '5214 9688 1896 5732',
    firstName: 'Krzysiek',
    lastName: 'Nowak',
    month: '05',
    year: 2021,
    cvv: 123,
  };

  const { handleSubmit, register, errors } = useForm({ defaultValues });

  const onSubmit = (data: any) => {
    const readyData = {
      paymentId, // TODO zebrać z poprzedniego etapu
      name: data.firstName + data.lastName,
      cardNumber: data.cardNumber,
      expiryDate: data.month + data.year.slice(2),
      cvv: data.cvv,
    };
    sentExecutePaymentRequest(readyData);
  };

  const onBack = () => {
    history.push(`/${UserService.getSlugByRole(user.role)}/order/step/agreement`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-step-payment">
      <FormHeader title="Podaj dane:" />
      <CreditCardInput register={register} errors={errors} />
      <ButtonsContainer max>
        <Button outline text={__('application.back')} click={() => onBack()} />
        <Button type="submit" primary text="Zapłać" />
      </ButtonsContainer>
    </form>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  formData: state.order.formData,
  countedPrice: state.order.countedPrice,
  paymentId: state.order.paymentId,
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
