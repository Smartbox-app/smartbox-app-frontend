import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router';
import { UserRes } from 'smartbox-types';
import { order } from '../../../../actions';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepSummary from './StepSummary';
import UserService from '../../../../services/user-service';
import { ApplicationState } from '../../../../reducers';

interface Props {
  user: UserRes;
  UpdateFormData: (data: any) => void;
}

const Form = ({ user }: Props) => (
  <Switch>
    <Route path={`/${UserService.getSlugByRole(user.role)}/order/step/1`} component={StepOne} />
    <Route path={`/${UserService.getSlugByRole(user.role)}/order/step/2`} component={StepTwo} />
    <Route path={`/${UserService.getSlugByRole(user.role)}/order/step/3`} component={StepSummary} />
    <Route path={`/${UserService.getSlugByRole(user.role)}/order/step/4`} component={StepSummary} />
  </Switch>
);

const mapStateToProps = (state: ApplicationState) => ({
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
