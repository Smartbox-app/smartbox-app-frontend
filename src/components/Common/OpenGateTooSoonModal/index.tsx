import React from 'react';
import { useDispatch } from 'react-redux';

import { modal } from 'src/actions';
import { Button } from 'src/components/Branded';
import Alert from 'src/components/Common/Alert';
import { ButtonsContainer } from 'src/components/Layout';
import { Modal } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';

const OpenGateTooSoonModal = () => {
  const dispatch = useDispatch();

  return (
    <>
      <Modal.Header title={__('application.openGateTooSoonTitle')} />
      <Modal.Content>
        <p>{__('application.openGateTooSoonMessage')}</p>
        <Alert type="notice" compact>
          {__('application.openGateTooSoonMessageNextAttempt')}
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

export { OpenGateTooSoonModal };
