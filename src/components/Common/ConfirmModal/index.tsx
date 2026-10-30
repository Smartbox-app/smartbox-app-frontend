import React from 'react';
import { useDispatch } from 'react-redux';

import { hideModal } from 'src/actions/modal';
import { Button, Spinner } from 'src/components/Branded';
import { ButtonsContainer } from 'src/components/Layout';
import { Modal } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';

interface Props {
  mainText: string;
  secondaryText?: string;
  cancelButtonText?: string;
  approveButtonText: string;
  approveAction: () => void;
  isLoading?: boolean;
}

const ConfirmModal = ({
  mainText,
  secondaryText,
  cancelButtonText = 'application.cancel',
  approveButtonText,
  approveAction,
  isLoading,
}: Props) => {
  const dispatch = useDispatch();

  return (
  <>
    <Modal.Header title={__('application.confirmation')} />
    <Modal.Content>
      {isLoading ? <Spinner halfTransparent overlay /> : null}
      <p>{__(mainText)}</p>
      {secondaryText ? (
        <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.85 }}>
          {__(secondaryText)}
        </p>
      ) : null}
    </Modal.Content>
    <Modal.Actions>
      <ButtonsContainer>
        <Button
          click={() => dispatch(hideModal())}
          text={cancelButtonText}
          danger
        />
        <Button
          success
          click={() => {
            approveAction();
            dispatch(hideModal());
          }}
          text={approveButtonText}
        />
      </ButtonsContainer>
    </Modal.Actions>
  </>
  );
};

export default ConfirmModal;
