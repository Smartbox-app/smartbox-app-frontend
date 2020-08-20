import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { withRouter } from 'react-router-dom';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RentBoxReq, UserRole, IPricingResult, UserRes } from 'smartbox-types';
import { Button } from '../../../../../components/Common';
import { order } from '../../../../../actions';
import { ButtonsContainer } from '../../../../../components/Layout';
import { history } from '../../../../../App';
import { FormType } from '../../../../../types/order-form';

import FormHeader from '../../../../../components/Layout/FormHeader';
import UserService from '../../../../../services/user-service';

import AgreementWrapper from './AgreementWrapper';
import ScrollPosition from './ScrollPosition';
import { ApplicationState } from '../../../../../reducers';

import './StepAgreement.scss';

interface Props {
  history: any;
  formData: FormType;
  countedPrice: IPricingResult;
  user: UserRes;
  isAgreementAccepted: boolean;
  isResignationMarked: boolean;
  updateFormData: (data: any) => void;
  sentRentBoxRequest: (data: RentBoxReq | any, nextStep: string, role: UserRole) => void;
}

const StepSummary = ({
  formData,
  user,
  isAgreementAccepted,
  isResignationMarked,
  sentRentBoxRequest,
  countedPrice,
}: Props) => {
  useEffect(() => {
    if (formData.size.length === 0) {
      history.push(`/${UserService.getSlugByRole(user.role)}/order/step/size`);
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
        discountCode: formData.discountCode,
      },
      'payment',
      user.role,
    );
  };

  const onBack = () => {
    history.push(`/${UserService.getSlugByRole(user.role)}/order/step/summary`);
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

const mapStateToProps = (state: ApplicationState) => ({
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
