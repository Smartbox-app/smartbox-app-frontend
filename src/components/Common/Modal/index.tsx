import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { modal } from 'src/actions';
import { Modal as UiModal } from 'src/components/ui';
import { ApplicationState } from 'src/reducers';
import type { AppDispatch } from 'src/types/app-dispatch';
import { Modal } from 'src/types/modal';

import './Modal.scss';

interface Props {
  modal: Modal;
  hideModal: () => void;
}

class ModalWrapper extends React.Component<Props> {
  private handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
    const { modal, hideModal } = this.props;
    if (
      event.target instanceof Element &&
      event.target.id === 'modal' &&
      modal.isClosable
    ) {
      hideModal();
    }
  };

  render() {
    const { modal, hideModal } = this.props;
    if (!modal.isVisible && !modal.isPrepared) {
      return null;
    }

    return (
      <>
        <div
          className={`modal ${modal.isVisible ? 'visible' : ''} ${modal.isFullscreen ? 'full-screen' : ''}`}
          id="modal"
          onMouseDown={this.handleClickOutside}
        >
          <div className="modal-body">
            <UiModal
              onClose={modal.isClosable ? hideModal : undefined}
              closable={modal.isClosable}
            >
              {modal.content}
            </UiModal>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state: ApplicationState) => ({
  modal: state.modal,
});

const mapDispatchToProps = (dispatch: AppDispatch) => bindActionCreators({ ...modal }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ModalWrapper);
