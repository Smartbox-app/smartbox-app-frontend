import React from 'react';
import { useForm } from 'react-hook-form';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { order } from '../../../../../actions';

interface Props {
  history: any;
  UpdateFormData: (data: any) => void;
}

const Step1 = ({ history, UpdateFormData }: any) => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log('StepOne', data);
    UpdateFormData(data);
    history.push('/admin/order/step2');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Step 1 - totaj pojawi się radio input z rodzajami</h2>
      <label>
        First Name:
        <input name="firstName" ref={register} />
      </label>
      <label>
        Last Name:
        <input name="lastName" ref={register} />
      </label>
      <input type="submit" />
    </form>
  );
};

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...order,
    },
    dispatch,
  );

export default withRouter(connect(null, mapDispatchToProps)(Step1));
