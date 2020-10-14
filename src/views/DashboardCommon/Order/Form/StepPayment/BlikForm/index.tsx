import React from 'react';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { ExecuteBlikPaymentReq, UserRes } from 'smartbox-types';
import { history } from '../../../../../../App';
import { Button, Spinner } from '../../../../../../components/Common';
import { ButtonsContainer, FormHeader } from '../../../../../../components/Layout';
import { __ } from '../../../../../../helpers/i18n';
import { ApplicationState } from '../../../../../../reducers';
import UserService from '../../../../../../services/user-service';
import { modal, order } from '../../../../../../actions';

import BlikInput from './BlikInput';
import BlikWaitingModal from './BlikWaitingModal';

interface RouteProps {
  step: string;
  rentId: string;
}

interface Props extends RouteComponentProps<RouteProps> {
  user: UserRes;
  paymentId: string;
  sentExecutePaymentWithBlikRequest: (data: any) => void;
  showModal: (content: React.ReactNode) => void;
}

const BlikForm = ({ user, paymentId, sentExecutePaymentWithBlikRequest, showModal, match }: Props) => {
  const defaultValues = {
    blikInput: '',
  };
  const { handleSubmit, register, watch } = useForm({ defaultValues });

  const onSubmit = (data: any) => {
    const req: ExecuteBlikPaymentReq = {
      paymentId,
      code: data.blikInput,
    };
    sentExecutePaymentWithBlikRequest(req);
    showModal(<Spinner />);
  };

  const onBack = () => {
    history.push(`/${UserService.getSlugByRole(user.role)}/order/step/agreement/${match.params.rentId || ''}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-step-payment-blik">
      <FormHeader title={__('application.enter6DigitCode')} />
      <BlikInput register={register} />
      <ButtonsContainer max>
        <Button outline text={__('application.back')} click={() => onBack()} />
        <Button
          type="submit"
          primary
          text={__('application.pay')}
          disabled={watch().blikInput === '' || watch().blikInput.length !== 6}
        />
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
      ...modal,
    },
    dispatch,
  );

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BlikForm));
