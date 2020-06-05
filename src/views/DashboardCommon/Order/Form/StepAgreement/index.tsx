import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { withRouter } from 'react-router-dom';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { IUser, RentBoxReq, UserRole, ExecutePaymentReq, IPricingResult } from 'smartbox-types';
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
  countedPrice: IPricingResult;
  user: IUser;
  isAgreementAccepted: boolean;
  isResignationMarked: boolean;
  updateFormData: (data: any) => void;
  formGoNextStep: (data: number) => void;
  sentRentBoxRequest: (data: RentBoxReq | any, nextStep: number, role: UserRole) => void;
}

const StepSummary = ({
  formData,
  formGoNextStep,
  user,
  isAgreementAccepted,
  isResignationMarked,
  sentRentBoxRequest,
  countedPrice,
}: Props) => {
  useEffect(() => {
    if (formData.size.length === 0) {
      history.push(`/${UserService.getSlugByRole(user.role)}/order/step/1`);
      formGoNextStep(1);
    }
  });

  const { handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    sentRentBoxRequest(
      {
        stockId: undefined,
        size: Number(formData.size),
        startAt: formData.dateStart,
        finishAt: formData.dateEnd,
        cost: countedPrice.value,
        discountCode: '',
      },
      5,
      user.role,
    );
  };

  const onBack = () => {
    formGoNextStep(3);
    history.push(`/${UserService.getSlugByRole(user.role)}/order/step/3`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormHeader title="Umowa zamówienia:" />
      <AgreementWrapper />
      <ScrollPosition />
      <ButtonsContainer max>
        <Button outline text="Wróć" click={() => onBack()} />
        <Button
          type="submit"
          primary
          text="Przejdź do płatności"
          disabled={!isAgreementAccepted || !isResignationMarked}
        />
      </ButtonsContainer>
    </form>
  );
};

const mapStateToProps = (state: any) => ({
  formData: state.order.formData,
  countedPrice: state.order.countedPrice,
  user: state.user.details,
  isAgreementAccepted: state.order.isAgreementAccepted,
  isResignationMarked: state.order.isResignationMarked,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...order,
    },
    dispatch,
  );

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(StepSummary));
