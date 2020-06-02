import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ApplicationState } from '../../../../../../reducers';
import { order } from '../../../../../../actions';

interface Props {
  register: any;
  isAgreementAccepted: boolean;
  formAgreementReaded: () => void;
}

class ScrollPosition extends Component<Props> {
  componentDidMount() {
    const el = document.querySelector('.order-agreement-wrapper');
    el && el.addEventListener('scroll', () => this.onScroll(el));
  }

  private onScroll = (el: any) => {
    if (el.scrollTop > 1330) {
      console.log(el.scrollTop);
      this.props.formAgreementReaded();
    }
  };

  render() {
    const { register, isAgreementAccepted } = this.props;
    return (
      <>
        <input
          name="agreement-accepted"
          type="checkbox"
          checked={isAgreementAccepted}
          id="test"
          ref={register({ required: true })}
          onChange={() => console.log()}
        />
      </>
    );
  }
}
const mapStateToPros = (state: ApplicationState) => ({
  isAgreementAccepted: state.order.isAgreementAccepted,
});

const mapDispatchToProps = (dispatch: any) => bindActionCreators({ ...order }, dispatch);

export default connect(mapStateToPros, mapDispatchToProps)(ScrollPosition);
