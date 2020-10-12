import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { ExecutePaymentReq, UserRes } from 'smartbox-types';
import { history } from '../../../../../../App';
import { Button } from '../../../../../../components/Common';
import CreditCardInput from '../../../../../../components/Common/CreditCardInput';
import { ButtonsContainer } from '../../../../../../components/Layout';
import FormHeader from '../../../../../../components/Layout/FormHeader';
import { __ } from '../../../../../../helpers/i18n';
import { ApplicationState } from '../../../../../../reducers';
import UserService from '../../../../../../services/user-service';
import { order } from '../../../../../../actions';

interface RouteProps {
  step: string;
  rentId: string;
}

interface Props extends RouteComponentProps<RouteProps> {
  paymentId: string;
  user: UserRes;
  sentExecutePaymentRequest: (data: ExecutePaymentReq, develop?: boolean) => void;
}

const CreditCardForm = ({ user, sentExecutePaymentRequest, paymentId, match }: Props) => {
  const { handleSubmit, register, errors, control, watch } = useForm();
  const onSubmit = (data: any) => {
    const readyData: ExecutePaymentReq = {
      paymentId: match.params.rentId || paymentId,
      name: data.owner,
      cardNumber: data.cardNumber,
      expiryDate: data.expirationDateMonth.value + data.expirationDateYear.value.slice(2),
      cvv: data.cvv,
    };
    sentExecutePaymentRequest(readyData, true);
  };

  const onBack = () => {
    history.push(`/${UserService.getSlugByRole(user.role)}/order/step/agreement`);
  };

  const submitValidation = (): boolean => {
    if (watch().cardNumber === '') {
      return true;
    } else if (watch().cvv === '') {
      return true;
    } else if (watch().owner === '') {
      return true;
    } else return watch().cvv === '';
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-step-payment">
      <FormHeader title={__('application.fillData')} />
      <CreditCardInput register={register} errors={errors} control={control} />
      <ButtonsContainer max>
        <Button outline text={__('application.back')} click={() => onBack()} />
        <Button type="submit" primary text={__('application.pay')} disabled={submitValidation()} />
      </ButtonsContainer>
    </form>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
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
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreditCardForm));
