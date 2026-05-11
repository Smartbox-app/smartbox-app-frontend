import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ButtonsContainer } from '../../Layout';
import { Button, Spinner } from '../../Branded';
import { modal } from '../../../actions';

import { __ } from '../../../helpers/i18n';

interface Props {
  mainText: string;
  cancelButtonText?: string;
  approveButtonText: string;
  hideModal: () => void;
  approveAction: () => void;
  isLoading?: boolean;
}

const ConfirmModal = ({
  mainText,
  cancelButtonText = 'application.cancel',
  approveButtonText,
  approveAction,
  hideModal,
  isLoading,
}: Props) => (
  <>
    {isLoading ? <Spinner halfTransparent overlay /> : null}
    <p>{__(mainText)}</p>
    <ButtonsContainer>
      <Button click={() => hideModal()} text={cancelButtonText} success />
      <Button
        danger
        click={() => {
          approveAction();
          hideModal();
        }}
        text={approveButtonText}
      />
    </ButtonsContainer>
  </>
);

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators({ ...modal }, dispatch);

export default connect(null, mapDispatchToProps)(ConfirmModal);
