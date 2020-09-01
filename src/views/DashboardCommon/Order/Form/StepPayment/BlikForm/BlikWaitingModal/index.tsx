import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { modal } from '../../../../../../../actions';
import { ApplicationState } from '../../../../../../../reducers';

interface Props {
  hideModal: () => void;
}

const BlikWaitingModal = ({ hideModal }: Props) => {
  useEffect(() => {
    const askServer = setInterval(() => {
      console.log('Odpytuje server');

      return function cleanUp() {
        console.log('componentWillUnmount');
        clearInterval(askServer);
        hideModal();
      };
    }, 1000);
  }, []);
  return (
    <div className="blik-waiting-modal">
      <h3>Dziękujemy za wybór naszej firmy</h3>
      <p>Proszę, potwierdzić płatność kodem PIN w aplikacji BLIK</p>
    </div>
  );
};

const mapStateToProps = (state: ApplicationState) => ({});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...modal,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(BlikWaitingModal);
