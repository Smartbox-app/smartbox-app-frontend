import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ApplicationState } from '../../../../../../reducers';
import { order } from '../../../../../../actions';
import { CheckBox } from '../../../../../../components/Common';
import { TenantState } from 'src/reducers/tenant-reducer';

interface Props {
  isResignationMarked: boolean;
  isAgreementAccepted: boolean;
  tenant: TenantState;
  formAgreementReaded: () => void;
  formResignationMarked: () => void;
}

class ScrollPosition extends Component<Props> {
  // private onScroll = (el: any) => {
  //   if (el.scrollTop > el.children[0].scrollHeight - el.clientHeight) {
  //     this.props.formAgreementReaded();
  //   }
  // };
  // componentDidMount(): void {
  //   const el = document.querySelector('.order-agreement-wrapper');
  //   el && el.addEventListener('scroll', () => this.onScroll(el), false);
  // }

  // componentWillUnmount(): void {
  //   const el = document.querySelector('.order-agreement-wrapper');
  //   el && el.removeEventListener('scroll', () => this.onScroll(el), false);
  // }

  render() {
    const { isResignationMarked, formResignationMarked, isAgreementAccepted, tenant } = this.props;
    return (
      <>
        <CheckBox
          name="resignation"
          checked={isResignationMarked}
          // hide={!isAgreementAccepted}
          // disabled={!isAgreementAccepted}
          handleChange={() => formResignationMarked()}
          label={`Akceptuję warunki Umowy i zgadzam się na rozpoczęcie świadczenia usług ${tenant?.name} przed upływem terminu do odstąpienia od Umowy`}
        />
      </>
    );
  }
}

const mapStateToProps = (state: ApplicationState) => ({
  isResignationMarked: state.order.isResignationMarked,
  isAgreementAccepted: state.order.isAgreementAccepted,
  tenant: state.tenant
});

const mapDispatchToProps = (dispatch: any) => bindActionCreators({ ...order }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ScrollPosition);
