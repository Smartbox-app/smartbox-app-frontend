import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { modal, order } from '../../../../../../../actions';
import { Spinner } from '../../../../../../../components/Common';
import { ApplicationState } from '../../../../../../../reducers';

interface Props {
  hideModal: () => void;
  paymentId: string;
  paymentSuccess: boolean;
  checkPaymentStatus: (paymentId: string) => void;
}

const BlikWaitingModal = ({ hideModal, paymentId, checkPaymentStatus, paymentSuccess }: Props) => {
  useEffect(() => {
    const askServer = setInterval(() => {
      checkPaymentStatus(paymentId);

      return function cleanUp() {
        clearInterval(askServer);
        hideModal();
      };
    }, 2000);
  }, []);
  return (
    <div className="blik-waiting-modal">
      <h3>Dziękujemy za wybór naszej firmy</h3>
      <p>Proszę, potwierdzić płatność kodem PIN w aplikacji BLIK</p>
      {!paymentSuccess && <Spinner />}
    </div>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  paymentId: state.order.paymentId,
  paymentSuccess: state.order.paymentSuccess,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...modal,
      ...order,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(BlikWaitingModal);
