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
import { formatPrice } from '../../../../../utils/format-price';
import UserService from '../../../../../services/user-service';

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
  useEffect(() => {
    if (formData.size.length === 0) {
      history.push(`/${UserService.getSlugByRole(user.role)}/order/step/1`);
    }
  });

  const { handleSubmit } = useForm();

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
      5,
      user.role,
    );
  };

  const onBack = () => {
    FormGoNextStep(3);
    history.push(`/${UserService.getSlugByRole(user.role)}/order/step/3`);
  };

  const desktop = window.matchMedia('(min-width: 920px)').matches;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormHeader title="Umowa zamówienia:" />
      <div className="order-agreement-wrapper">
        {desktop && (
          <object className="rules-embed" data="/assets/dummy_pdf.pdf" type="application/pdf">
            Regulamin serwisu
          </object>
        )}
        {!desktop && <h2>Przeczytaj i zaakceptuj regulamin</h2>}
      </div>

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
