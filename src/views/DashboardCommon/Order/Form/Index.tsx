import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router';
import { order } from '../../../../actions';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';

interface Props {
  formData: {};
  UpdateFormData: (data: any) => void;
}

const Form = (props: Props) => (
  <Switch>
    <Route exact path="/admin/order" component={StepOne} />
    <Route path="/admin/order/step2" component={StepTwo} />
    <Route path="/admin/order/step3" component={StepThree} />
    <Route path="/admin/order/result" component={StepTwo} />
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
