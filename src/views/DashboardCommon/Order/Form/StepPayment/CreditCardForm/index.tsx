import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { ExecutePaymentReq, UserRes } from 'smartbox-types';
import { history } from '../../../../../../App';
import { Alert, Button, Spinner } from '../../../../../../components/Common';
import { ButtonsContainer } from '../../../../../../components/Layout';
import { ApplicationState } from '../../../../../../reducers';
import UserService from '../../../../../../services/user-service';
import { order, paymentStatus } from '../../../../../../actions';

import './CreditCardForm.scss';

interface RouteProps {
  step: string;
  rentId: string;
}

interface Props extends RouteComponentProps<RouteProps> {
  paymentId: string;
  user: UserRes;
  func: any;
  loading: boolean;
  sentExecutePaymentRequest: (data: ExecutePaymentReq, develop?: boolean) => void;
  getCardForm: (paymentId: string) => void;
}

const CreditCardForm = ({ func, user, sentExecutePaymentRequest, paymentId, match, getCardForm, loading }: Props) => {
  const [autoPayment, setAutoPayment] = useState(false);
  useEffect(() => {
    paymentId ? getCardForm(paymentId) : history.push(`/${UserService.getSlugByRole(user.role)}/order/step/size`);
  }, []);

  useEffect(() => {
    if (func?.length <= 3) {
      setAutoPayment(true);
    } else {
      eval(func);
    }
    return () => {};
  }, [func]);

  const onBack = () => {
    history.push(`/${UserService.getSlugByRole(user.role)}/order/step/agreement/${match.params.rentId || ''}`);
  };

  return (
    <div className="credit-card-input-wrapper">
      {autoPayment ? (
        <>
          {loading ? (
            <Spinner />
          ) : (
            <>
              <Alert type="success" text='notification.paymentFinishedSuccess' />
              <ButtonsContainer max>
                <Button outline text='application.backToHome' to="/" />
              </ButtonsContainer>
            </>
          )}
        </>
      ) : (
        <div className="payment-wrapper">
          <div className="pay-button-container" />
          <ButtonsContainer max>
            <Button outline text='application.back' click={() => onBack()} />
          </ButtonsContainer>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  paymentId: state.order.paymentId,
  user: state.user.details,
  func: state.paymentStatus.func,
  loading: state.spinner.loading,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...order,
      ...paymentStatus,
    },
    dispatch,
  );
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreditCardForm));
