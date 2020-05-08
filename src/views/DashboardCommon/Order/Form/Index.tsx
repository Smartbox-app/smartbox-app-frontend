import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router';
import { order } from '../../../../actions';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepSummary from './StepSummary';

interface Props {
  formData: {};
  UpdateFormData: (data: any) => void;
}

const Form = (props: Props) => (
  <Switch>
    <Route path="/admin/order/step/1" component={StepOne} />
    <Route path="/admin/order/step/2" component={StepTwo} />
    <Route path="/admin/order/step/3" component={StepSummary} />
    <Route path="/admin/order/step/4" component={StepSummary} />
  </Switch>
);

const mapStateToProps = (state: any) => ({
  formData: state.order.formData,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...order,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(Form);
