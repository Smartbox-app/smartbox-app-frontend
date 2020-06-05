import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router';

import { UserRes } from 'smartbox-types';
import UserService from '../../../../services/user-service';
import { ApplicationState } from '../../../../reducers';

import StepSize from './StepSize';
import StepDuration from './StepDuration';
import StepPayment from './StepPayment';
import StepAgreement from './StepAgreement';
import StepSummary from './StepSummary';

interface Props {
  user: UserRes;
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

const mapStateToProps = (state: ApplicationState) => ({
  user: state.user.details,
});

export default connect(mapStateToProps)(Form);
