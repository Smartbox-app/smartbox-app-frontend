import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { modal, notifications, order } from '../../../../../../../actions';
import { Spinner } from '../../../../../../../components/Common';
import { __ } from '../../../../../../../helpers/i18n';
import { ApplicationState } from '../../../../../../../reducers';
import { history } from '../../../../../../../App';

interface Props {
  hideModal: () => void;
  paymentId: string;
  paymentSuccess: boolean;
  blikPaymentCompletedSuccessfully: boolean;
  checkPaymentStatus: (paymentId: string) => void;
  successNotification: (text: string) => void;
}

const BlikWaitingModal = ({
  hideModal,
  paymentId,
  checkPaymentStatus,
  paymentSuccess,
  blikPaymentCompletedSuccessfully,
  successNotification,
}: Props) => {
  const intervalCallBack = () => {
    if (blikPaymentCompletedSuccessfully) {
      successNotification('Płatność zakończyła się sukcesem');
      hideModal();
      history.push(`/payment-success/${paymentId}`);
    }

    checkPaymentStatus(paymentId);
  };

  useEffect(() => {
    const askServer = setInterval(intervalCallBack, 3000);
    return () => {
      clearInterval(askServer);
      // hideModal();
      // history.push(`/payment-success/${paymentId}`);
    };
  }, [blikPaymentCompletedSuccessfully]);

  return (
    <div className="blik-waiting-modal">
      <h3>{__('application.thanksForBuy')}</h3>
      <p>{__('application.confirmBlik')}</p>
      {!paymentSuccess && <Spinner />}
    </div>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  paymentId: state.order.paymentId,
  paymentSuccess: state.order.paymentSuccess,
  blikPaymentCompletedSuccessfully: state.order.blikPaymentCompletedSuccessfully,
  user: state.user.details,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...modal,
      ...order,
      ...notifications,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(BlikWaitingModal);
