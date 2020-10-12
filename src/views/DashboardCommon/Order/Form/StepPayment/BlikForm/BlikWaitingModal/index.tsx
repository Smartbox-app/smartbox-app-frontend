import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { UserRes } from 'smartbox-types';
import { modal, order } from '../../../../../../../actions';
import { Spinner } from '../../../../../../../components/Common';
import { ApplicationState } from '../../../../../../../reducers';
import { history } from '../../../../../../../App';
import UserService from '../../../../../../../services/user-service';

interface Props {
  hideModal: () => void;
  paymentId: string;
  paymentSuccess: boolean;
  user: UserRes;
  blikPaymentCompletedSuccessfully: boolean;
  checkPaymentStatus: (paymentId: string) => void;
}

const BlikWaitingModal = ({
  hideModal,
  paymentId,
  checkPaymentStatus,
  paymentSuccess,
  blikPaymentCompletedSuccessfully,
  user,
}: Props) => {
  useEffect(() => {
    const askServer = setInterval(() => {
      checkPaymentStatus(paymentId);
      console.log('blikPaymentCompletedSuccessfully', blikPaymentCompletedSuccessfully);
      if (blikPaymentCompletedSuccessfully) {
        clearInterval(askServer);
        hideModal();
        history.push(`/${UserService.getSlugByRole(user.role)}/invoice`);
      }

      return function cleanUp() {
        clearInterval(askServer);
        hideModal();
      };
    }, 3000);
  }, []);
  return (
    <div className="blik-waiting-modal">
      <h3>Dziękujemy za wybór naszej firmy</h3>
      <p>Proszę potwierdzić płatność kodem PIN w aplikacji BLIK</p>
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
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(BlikWaitingModal);
