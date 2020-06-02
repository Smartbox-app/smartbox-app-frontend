import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ApplicationState } from '../../../../../../reducers';
import { order } from '../../../../../../actions';

interface Props {
  formAgreementReaded: () => void;
}

class ScrollPosition extends Component<Props> {
  componentDidMount() {
    const el = document.querySelector('.order-agreement-wrapper');
    el && el.addEventListener('scroll', () => this.onScroll(el));
  }

  private onScroll = (el: any) => {
    if (el.scrollTop > 1330) {
      this.props.formAgreementReaded();
    }
  };

  render() {
    return <></>;
  }
}

const mapDispatchToProps = (dispatch: any) => bindActionCreators({ ...order }, dispatch);

export default connect(null, mapDispatchToProps)(ScrollPosition);
