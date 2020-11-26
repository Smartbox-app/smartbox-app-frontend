import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { modal } from '../../../actions';
import { Modal } from '../../../types/modal';
import { ApplicationState } from '../../../reducers';

import './Modal.scss';
import ModalContent from './ModalContent';

interface Props {
  modal: Modal;
  hideModal: () => void;
}

class ModalWrapper extends React.Component<Props> {
  private handleClickOutside = (e: any) => {
    const { modal, hideModal } = this.props;
    if (e.target.id === 'modal' && modal.isClosable) hideModal();
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
          onClick={this.handleClickOutside}
          id="modal"
        >
          <div className="modal-body">
            <ModalContent>
              {modal.content}
              {modal.isClosable && (
                <span className="modal-exit" role="button" tabIndex={0} onClick={() => hideModal()}>
                  &times;
                </span>
              )}
            </ModalContent>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state: ApplicationState) => ({
  modal: state.modal,
});

function mapDispatchToProps(dispatch: any) {
  return bindActionCreators({ ...modal }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalWrapper);
