import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { modal } from '../../../actions';
import { Modal } from '../../../types/modal';

import './Modal.scss';

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
            <div className="modal-content">{modal.content}</div>
            {modal.isClosable && (
              <span className="modal-exit" onClick={() => hideModal()}>
                &times;
              </span>
            )}
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state: any) => ({
  modal: state.modal,
});

function mapDispatchToProps(dispatch: any) {
  return bindActionCreators({ ...modal }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalWrapper);
