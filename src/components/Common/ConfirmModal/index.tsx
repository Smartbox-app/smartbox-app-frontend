import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Spinner } from '../../Branded';
import { modal } from '../../../actions';

import { __ } from '../../../helpers/i18n';
import { Modal } from 'src/components/ui';
import { ButtonsContainer } from 'src/components/Layout';

interface Props {
  mainText: string;
  secondaryText?: string;
  cancelButtonText?: string;
  approveButtonText: string;
  hideModal: () => void;
  approveAction: () => void;
  isLoading?: boolean;
}

const ConfirmModal = ({
  mainText,
  secondaryText,
  cancelButtonText = 'application.cancel',
  approveButtonText,
  approveAction,
  hideModal,
  isLoading,
}: Props) => (
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
        <Button click={() => hideModal()} text={cancelButtonText} danger />
        <Button
          success
          click={() => {
            approveAction();
            hideModal();
          }}
          text={approveButtonText}
        />
      </ButtonsContainer>
    </Modal.Actions>
  </>
);

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators({ ...modal }, dispatch);

export default connect(null, mapDispatchToProps)(ConfirmModal);
