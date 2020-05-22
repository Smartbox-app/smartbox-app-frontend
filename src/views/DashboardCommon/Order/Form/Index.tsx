import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router';
import { IUser } from 'smartbox-types';
import { order } from '../../../../actions';
import StepSize from './StepSize';
import StepDuration from './StepDuration';
import StepSummary from './StepSummary';
import StepPayment from './StepPayment';
import StepAgreement from './StepAgreement';
import UserService from '../../../../services/user-service';

interface Props {
  formData: {};
  user: IUser;
  UpdateFormData: (data: any) => void;
}

const Form = ({ user }: Props) => (
  <Switch>
    <Route path={`/${UserService.getSlugByRole(user.role)}/order/step/1`} component={StepSize} />
    <Route path={`/${UserService.getSlugByRole(user.role)}/order/step/2`} component={StepDuration} />
    <Route path={`/${UserService.getSlugByRole(user.role)}/order/step/3`} component={StepSummary} />
    <Route path={`/${UserService.getSlugByRole(user.role)}/order/step/4`} component={StepAgreement} />
    <Route path={`/${UserService.getSlugByRole(user.role)}/order/step/5`} component={StepPayment} />
  </Switch>
);

const mapStateToProps = (state: any) => ({
  formData: state.order.formData,
  user: state.user.details,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...order,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(Form);
