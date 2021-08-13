import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { UserRes } from 'smartbox-types';
import { history } from '../../../../../../App';
import { ButtonsContainer, PageHeader } from '../../../../../../components/Layout';
import { __ } from '../../../../../../helpers/i18n';
import { ApplicationState } from '../../../../../../reducers';
import { PaymentMethodDetail } from '../../../../../../reducers/order-reducer';
import { modal, order } from '../../../../../../actions';

import './BankForm.scss';
import { Button, Spinner } from '../../../../../../components/Common';
import UserService from '../../../../../../services/user-service';

interface RouteProps {
  step: string;
  rentId: string;
}

interface Props extends RouteComponentProps<RouteProps> {
  bankGroup: PaymentMethodDetail;
  user: UserRes;
  paymentId: string;
  sentExecutePaymentWithTpayRequest: (paymentId: string, group: string) => void;
  func: any;
  loading: boolean;
}

const BankForm = ({ func, paymentId, sentExecutePaymentWithTpayRequest, bankGroup, loading, user, match }: Props) => {
  useEffect(() => {
    sentExecutePaymentWithTpayRequest(paymentId, bankGroup.id);
  }, []);
  const onBack = () => {
    history.push(`/${UserService.getSlugByRole(user.role)}/order/step/agreement/${match.params.rentId || ''}`);
  };
  return (
    <div className="form-step-payment-blik">
      {loading ? (
        <Spinner />
      ) : (
        <div className="payment-wrapper">
          <div className="bank-input-wrapper">
            <div dangerouslySetInnerHTML={{ __html: func || '' }} />
          </div>
          <ButtonsContainer max>
            <Button outline text={__('application.back')} click={() => onBack()} />
          </ButtonsContainer>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  paymentId: state.order.paymentId,
  user: state.user.details,
  bankGroup: state.order.selectedPaymentMethodDetail,
  func: state.paymentStatus.func,
  loading: state.spinner.loading,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...order,
      ...modal,
    },
    dispatch,
  );

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BankForm));
