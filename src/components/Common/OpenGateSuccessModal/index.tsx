import React from 'react';
import { ButtonsContainer } from '../../Layout';
import { Button } from '../../Branded';
import { __ } from '../../../helpers/i18n';
import { useDispatch } from 'react-redux';
import { modal } from '../../../actions';
import { Modal } from 'src/components/ui';
import Alert from '../Alert';
import { GateAnimation } from '../GateAnimation';

const OpenGateSuccessModal = () => {
  const dispatch = useDispatch();

  return (
    <>
      <Modal.Header title={__('application.openingGate')} />
      <Modal.Content>
        <GateAnimation />
        <p>{__('application.theGateOpens')}</p>

        <Alert type="notice" compact>
          {__('application.theGateOpensNextAttempt')}
        </Alert>
      </Modal.Content>
      <Modal.Actions>
        <ButtonsContainer>
          <Button
            click={() => dispatch(modal.hideModal())}
            text="application.understood"
          />
        </ButtonsContainer>
      </Modal.Actions>
    </>
  );
};

export { OpenGateSuccessModal };
