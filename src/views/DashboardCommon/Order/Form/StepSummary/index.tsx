import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { withRouter } from 'react-router-dom';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RentBoxReq, UserRole, UserRes } from 'smartbox-types';
import { Button } from '../../../../../components/Common';
import { order } from '../../../../../actions';
import { ButtonsContainer } from '../../../../../components/Layout';
import { history } from '../../../../../App';
import { Form } from '../../../../../reducers/order-reducer';

import FormHeader from '../../../../../components/Layout/FormHeader';
import UserService from '../../../../../services/user-service';
import Discount from './DiscountsList';
import SummaryTable from './SummaryTable';
import { ApplicationState } from '../../../../../reducers';

import './StepSummary.scss';

interface Props {
  history: any;
  formData: Form;
  countedPrice: number;
  user: UserRes;
  UpdateFormData: (data: any) => void;
  FormGoNextStep: (data: number) => void;
  sentRentBoxRequest: (data: RentBoxReq | any, nextStep: number, role: UserRole) => void;
}

const StepSummary = ({ formData, countedPrice, UpdateFormData, FormGoNextStep, user, sentRentBoxRequest }: Props) => {
  useEffect(() => {
    if (formData.size.length === 0) {
      history.push(`/${UserService.getSlugByRole(user.role)}/order/step/1`);
    }
  });

  const { handleSubmit, register, watch } = useForm();

  const onSubmit = (data: any) => {
    UpdateFormData(data);
    sentRentBoxRequest(
      {
        stockId: undefined,
        size: Number(formData.size),
        startAt: formData.dateStart,
        finishAt: formData.dateEnd,
        cost: 1,
        discountCode: '',
      },
      4,
      user.role,
    );
  };

  const onBack = () => {
    FormGoNextStep(2);
    history.push(`/${UserService.getSlugByRole(user.role)}/order/step/2`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-step-two">
      <Discount register={register} />
      <FormHeader title="Podsumowanie zamówienia:" />
      <SummaryTable dateStart={formData.dateStart} dateEnd={formData.dateEnd} countedPrice={countedPrice} />
      <ButtonsContainer max>
        <Button outline text="Wróć" click={() => onBack()} />
        <Button type="submit" primary text="Przejdź do umowy" />
      </ButtonsContainer>
    </form>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
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
