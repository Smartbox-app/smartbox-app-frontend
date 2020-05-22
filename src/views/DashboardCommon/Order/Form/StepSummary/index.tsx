import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { withRouter } from 'react-router-dom';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { IUser, RentBoxReq } from 'smartbox-types';
import { Button } from '../../../../../components/Common';
import { order } from '../../../../../actions';
import { ButtonsContainer } from '../../../../../components/Layout';
import { history } from '../../../../../App';
import { Form } from '../../../../../reducers/order-reducer';

import FormHeader from '../../../../../components/Layout/FormHeader';
import { formatPrice } from '../../../../../utils/format-price';
import UserService from '../../../../../services/user-service';
import Discount from './DiscountsList';

import './StepSummary.scss';

interface Props {
  history: any;
  formData: Form;
  countedPrice: number;
  user: IUser;
  UpdateFormData: (data: any) => void;
  FormGoNextStep: (data: number) => void;
  sentRentBoxRequest: (data: RentBoxReq | any) => void;
}

const StepSummary = ({ formData, countedPrice, UpdateFormData, FormGoNextStep, user, sentRentBoxRequest }: Props) => {
  // useEffect(() => {
  //   if (formData.size.length === 0) {
  //     history.push(`/${UserService.getSlugByRole(user.role)}/order/step/1`);
  //   }
  // });

  const { handleSubmit, register, watch } = useForm();

  const onSubmit = (data: any) => {
    console.log('onSubmit', data);
    // UpdateFormData(data);
    // sentRentBoxRequest({
    //   stockId: undefined,
    //   size: Number(formData.size),
    //   startAt: formData.dateStart,
    //   finishAt: formData.dateEnd,
    //   cost: 1,
    // });
    // FormGoNextStep(4);
    // history.push(`/${UserService.getSlugByRole(user.role)}/order/step/4`);
  };

  const onBack = () => {
    FormGoNextStep(2);
    history.push(`/${UserService.getSlugByRole(user.role)}/order/step/2`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-step-two">
      <Discount register={register} />
      <FormHeader title="Podsumowanie zamówienia:" />
      <div className="order-summary-wrapper">
        <div className="row">
          Termin rozpoczęcia wynajmu: <span>{formData.dateStart.toLocaleDateString()}</span>
        </div>
        <div className="row">
          Termin rozpoczęcia wynajmu: <span>{formData.dateEnd.toLocaleDateString()}</span>
        </div>
        <div className="row">
          Opłata za wynajem: <span>{formatPrice(countedPrice)}</span>
        </div>
      </div>

      <ButtonsContainer max>
        <Button outline text="Wróć" click={() => onBack()} />
        <Button type="submit" primary text="Przejdź do umowy" />
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
