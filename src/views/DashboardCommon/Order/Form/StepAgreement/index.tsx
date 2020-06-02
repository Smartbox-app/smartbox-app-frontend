import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { withRouter } from 'react-router-dom';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { IUser, RentBoxReq, UserRole } from 'smartbox-types';
import { Button } from '../../../../../components/Common';
import { order } from '../../../../../actions';
import { ButtonsContainer } from '../../../../../components/Layout';
import { history } from '../../../../../App';
import { Form } from '../../../../../reducers/order-reducer';

import FormHeader from '../../../../../components/Layout/FormHeader';
import UserService from '../../../../../services/user-service';

import AgreementWrapper from './AgreementWrapper';
import ScrollPosition from './ScrollPosition';

import './StepAgreement.scss';

interface Props {
  history: any;
  formData: Form;
  countedPrice: number;
  user: IUser;
  UpdateFormData: (data: any) => void;
  FormGoNextStep: (data: number) => void;
  sentRentBoxRequest: (data: RentBoxReq | any, nextStep: number, role: UserRole) => void;
}

const StepSummary = ({ formData, countedPrice, UpdateFormData, FormGoNextStep, user, sentRentBoxRequest }: Props) => {
  // useEffect(() => {
  //   if (formData.size.length === 0) {
  //     history.push(`/${UserService.getSlugByRole(user.role)}/order/step/1`);
  //   }
  // });

  const { handleSubmit, register } = useForm();

  const onSubmit = (data: any) => {};

  const onBack = () => {
    FormGoNextStep(3);
    history.push(`/${UserService.getSlugByRole(user.role)}/order/step/3`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormHeader title="Umowa zamówienia:" />
      <AgreementWrapper />
      <ScrollPosition register={register} />
      <ButtonsContainer max>
        <Button outline text="Wróć" click={() => onBack()} />
        <Button type="submit" primary text="Przejdź do płatności" />
      </ButtonsContainer>
    </form>
  );
};

const mapStateToProps = (state: any) => ({
  formData: state.order.formData,
  countedPrice: state.order.countedPrice,
  user: state.user.details,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...order,
    },
    dispatch,
  );

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(StepSummary));
