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
import { order, paymentStatus } from '../../../../../../actions';
import { encryptMessage } from '../../../../../../utils/crypt';
import ApiService from '../../../../../../services/api-service';

interface RouteProps {
  step: string;
  rentId: string;
}

interface Props extends RouteComponentProps<RouteProps> {
  paymentId: string;
  user: UserRes;
  func: any;
  sentExecutePaymentRequest: (data: ExecutePaymentReq, develop?: boolean) => void;
  getCardForm: (paymentId: string) => void;
}

const CreditCardForm = ({ func, user, sentExecutePaymentRequest, paymentId, match, getCardForm }: Props) => {
  useEffect(() => {
    paymentId ? getCardForm(paymentId) : history.push(`/${UserService.getSlugByRole(user.role)}/main`);
  }, []);

  return (
    <>
      <div className="form-container" />
      {eval(func)}
    </>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  paymentId: state.order.paymentId,
  user: state.user.details,
  func: state.paymentStatus.func,
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
