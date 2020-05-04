import React from 'react';
import { useForm } from 'react-hook-form';
import { withRouter } from 'react-router-dom';

const Step1 = (props: any) => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log('StepOne', data);
    props.history.push('./step2');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Step 1</h2>
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

export default withRouter(Step1);
