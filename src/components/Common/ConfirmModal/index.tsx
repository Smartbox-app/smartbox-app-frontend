import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ButtonsContainer } from '../../Layout';
import { Button } from '..';
import { modal } from '../../../actions';

import './ConfirmModal.scss';

interface Props {
  mainText: string;
  cancelButtonText?: string;
  aproveButtonText: string;
  hideModal: () => void;
  approveAction: () => void;
}

const ConfirmModal = ({ mainText, cancelButtonText = 'Anuluj', aproveButtonText, approveAction, hideModal }: Props) => (
  <div className="confirm-modal-wrapper">
    <p>{mainText}</p>
    <ButtonsContainer>
      <Button click={() => hideModal()} text={cancelButtonText} />
      <Button
        danger
        click={() => {
          approveAction();
          hideModal();
        }}
        text={aproveButtonText}
      />
    </ButtonsContainer>
  </div>
);

const mapDispatchToProps = (dispatch: any) => bindActionCreators({ ...modal }, dispatch);

export default connect(null, mapDispatchToProps)(ConfirmModal);
