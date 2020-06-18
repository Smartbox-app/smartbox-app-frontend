import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { withRouter } from 'react-router-dom';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { UserRes, IPricingResult } from 'smartbox-types';
import { Button } from '../../../../../components/Common';
import { order } from '../../../../../actions';
import { ButtonsContainer } from '../../../../../components/Layout';
import { history } from '../../../../../App';
import { FormType } from '../../../../../types/order-form';

import FormHeader from '../../../../../components/Layout/FormHeader';
import UserService from '../../../../../services/user-service';
import Discount from './DiscountsList';
import SummaryTable from './SummaryTable';
import { ApplicationState } from '../../../../../reducers';

import './StepSummary.scss';

interface Props {
  history: any;
  formData: FormType;
  countedPrice: IPricingResult;
  user: UserRes;
  updateFormData: (data: any) => void;
}

const StepSummary = ({ formData, countedPrice, updateFormData, user }: Props) => {
  useEffect(() => {
    if (formData.size.length === 0) {
      history.push(`/${UserService.getSlugByRole(user.role)}/order/step/size`);
    }
  });

  const { handleSubmit, register } = useForm();

  const onSubmit = (data: any) => {
    updateFormData(data);
    history.push(`/${UserService.getSlugByRole(user.role)}/order/step/agreement`);
  };

  const onBack = () => {
    history.push(`/${UserService.getSlugByRole(user.role)}/order/step/duration`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-step-two">
      <Discount register={register} />
      <FormHeader title="Podsumowanie zamówienia:" />
      <SummaryTable dateStart={formData.dateStart} dateEnd={formData.dateEnd} countedPrice={countedPrice.value} />
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
