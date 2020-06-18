import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ApplicationState } from '../../../../../../reducers';
import { order } from '../../../../../../actions';
import { CheckBox } from '../../../../../../components/Common';

interface Props {
  isResignationMarked: boolean;
  isAgreementAccepted: boolean;
  formAgreementReaded: () => void;
  formResignationMarked: () => void;
}

class ScrollPosition extends Component<Props> {
  componentDidMount() {
    const el = document.querySelector('.order-agreement-wrapper');
    el && el.addEventListener('scroll', () => this.onScroll(el));
  }

  private onScroll = (el: any) => {
    if (el.scrollTop > el.scrollTopMax * 0.95) {
      this.props.formAgreementReaded();
    }
  };

  render() {
    const { isResignationMarked, formResignationMarked, isAgreementAccepted } = this.props;
    return (
      <>
        <CheckBox
          name="resignation"
          checked={isResignationMarked}
          disabled={!isAgreementAccepted}
          handleChange={() => formResignationMarked()}
          label="Rezygnuje z możliwości 14 dniowego wypowiedzenia i zgadza się na uruchomienie usługi."
        />
      </>
    );
  }
}

const mapStateToProps = (state: ApplicationState) => ({
  isResignationMarked: state.order.isResignationMarked,
  isAgreementAccepted: state.order.isAgreementAccepted,
});

const mapDispatchToProps = (dispatch: any) => bindActionCreators({ ...order }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ScrollPosition);
