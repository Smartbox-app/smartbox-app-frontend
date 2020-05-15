import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { withRouter } from 'react-router-dom';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { IUser, ExecutePaymentReq } from 'smartbox-types';
import { Button } from '../../../../../components/Common';
import { order } from '../../../../../actions';
import { ButtonsContainer } from '../../../../../components/Layout';
import { history } from '../../../../../App';
import { Form } from '../../../../../reducers/order-reducer';
import FormHeader from '../../../../../components/Layout/FormHeader';
import UserService from '../../../../../services/user-service';
import CreditCardInput from '../../../../../components/Common/CreditCardInput';

import './StepPayment.scss';

interface Props {
  history: any;
  formData: Form;
  countedPrice: number;
  paymentId: string;
  user: IUser;
  FormGoNextStep: (data: number) => void;
}

const StepPayment = ({ formData, FormGoNextStep, user }: Props) => {
  // useEffect(() => {
  //   if (formData.size.length === 0) {
  //     history.push(`/${UserService.getSlugByRole(user.role)}/order/step/1`);
  //   }
  // });
  const defaultValues = {
    'card-number': '5214 9688 1896 5732',
    'first-name': 'Krzysiek',
    'last-name': 'Nowak',
    month: '05',
    year: 2021,
    cvv: 123,
  };

  const { handleSubmit, register, errors } = useForm({ defaultValues });

  const onSubmit = (data: any) => {
    console.log('StepPayment', data);
  };

  const onBack = () => {
    FormGoNextStep(2);
    history.push(`/${UserService.getSlugByRole(user.role)}/order/step/2`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-step-payment">
      <FormHeader title="Podaj dane:" />
      <CreditCardInput register={register} errors={errors} />
      <ButtonsContainer max>
        <Button outline text="Wróć" click={() => onBack()} />
        <Button type="submit" primary text="Zapłać" />
      </ButtonsContainer>
    </form>
  );
};

const mapStateToProps = (state: any) => ({
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
