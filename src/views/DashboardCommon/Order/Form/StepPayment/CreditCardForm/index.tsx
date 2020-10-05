import React from 'react';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ExecutePaymentReq, IPricingResult, UserRes } from 'smartbox-types';
import { history } from '../../../../../../App';
import { Button } from '../../../../../../components/Common';
import CreditCardInput from '../../../../../../components/Common/CreditCardInput';
import { ButtonsContainer } from '../../../../../../components/Layout';
import FormHeader from '../../../../../../components/Layout/FormHeader';
import { __ } from '../../../../../../helpers/i18n';
import { ApplicationState } from '../../../../../../reducers';
import UserService from '../../../../../../services/user-service';
import { FormType } from '../../../../../../types/order-form';
import { order } from '../../../../../../actions';

interface Props {
  formData: FormType;
  countedPrice: IPricingResult;
  paymentId: string;
  user: UserRes;
  sentExecutePaymentRequest: (data: ExecutePaymentReq) => void;
}

const CreditCardForm = ({ formData, user, sentExecutePaymentRequest, paymentId }: Props) => {
  const defaultValues = {
    cardNumber: '5214 9688 1896 5732',
    firstName: 'Krzysiek',
    lastName: 'Nowak',
    month: '05',
    year: 2021,
    cvv: 123,
  };

  const { handleSubmit, register, errors } = useForm();

  const onSubmit = (data: any) => {
    const readyData = {
      paymentId,
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
      <FormHeader title={__('application.fillData')} />
      <CreditCardInput register={register} errors={errors} />
      <ButtonsContainer max>
        <Button outline text={__('application.back')} click={() => onBack()} />
        <Button type="submit" primary text={__('application.pay')} />
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

export default connect(mapStateToProps, mapDispatchToProps)(CreditCardForm);
