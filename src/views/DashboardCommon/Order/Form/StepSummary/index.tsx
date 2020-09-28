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
import { ApplicationState } from '../../../../../reducers';
import { MainPaymentWay } from '../../../../../reducers/order-reducer';
import { __ } from '../../../../../helpers/i18n';

import Discount from './DiscountsList';
import PaymentMethods from './PaymentMethods';
import SummaryTable from './SummaryTable';

import './StepSummary.scss';

interface Props {
  history: any;
  formData: FormType;
  countedPrice: IPricingResult;
  user: UserRes;
  selectedPaymentMethod: any;
  updateFormData: (data: any) => void;
}

const StepSummary = ({ formData, countedPrice, updateFormData, user, selectedPaymentMethod }: Props) => {
  useEffect(() => {
    if (formData.size.length === 0) {
      // history.push(`/${UserService.getSlugByRole(user.role)}/order/step/size`);
    }
  });

  const defaultValues = {
    paymentType: `${MainPaymentWay.card}`,
  };

  const { handleSubmit, register, watch } = useForm({ defaultValues });

  const onSubmit = (data: any) => {
    updateFormData(data);
    history.push(`/${UserService.getSlugByRole(user.role)}/order/step/agreement`);
  };

  const onBack = () => {
    history.push(`/${UserService.getSlugByRole(user.role)}/order/step/duration`);
  };

  const dataVerification = (): boolean => {
    if (typeof watch().paymentType !== 'string') {
      return true;
    } else if (Number(watch().paymentType) === MainPaymentWay.other) {
      return selectedPaymentMethod.id === 0;
    } else {
      return false;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-step-two">
      <Discount />
      <FormHeader title="Podsumowanie zamówienia:" />
      <SummaryTable dateStart={formData.dateStart} dateEnd={formData.dateEnd} countedPrice={countedPrice.value} />
      <PaymentMethods register={register} />
      <ButtonsContainer max>
        <Button outline text={__('application.back')} click={() => onBack()} />
        <Button type="submit" primary text="Przejdź do umowy" disabled={dataVerification()} />
      </ButtonsContainer>
    </form>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  formData: state.order.formData,
  countedPrice: state.order.countedPrice,
  user: state.user.details,
  selectedPaymentMethod: state.order.selectedPaymentMethodDetail,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...order,
    },
    dispatch,
  );

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(StepSummary));
