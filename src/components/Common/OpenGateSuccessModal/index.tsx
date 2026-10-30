import React from 'react';
import { useDispatch } from 'react-redux';

import { modal } from 'src/actions';
import { Button } from 'src/components/Branded';
import Alert from 'src/components/Common/Alert';
import { GateAnimation } from 'src/components/Common/GateAnimation';
import { ButtonsContainer } from 'src/components/Layout';
import { Modal } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';

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
