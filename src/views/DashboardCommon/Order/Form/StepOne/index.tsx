import React from 'react';
import { useForm } from 'react-hook-form';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { order } from '../../../../../actions';
import { FormContainer } from '../../../../../components/Layout';

import './StepOne.scss';

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
    <FormContainer className="step-one-wrapper">
      <h2>Step 1 - totaj pojawi się radio input z rodzajami</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="options-wrapper">
          <label htmlFor="option1">
            <div className="radio-img" />
            <input name="Wybór" type="radio" value="3m2" id="option1" ref={register({ required: true })} />
          </label>
          <label htmlFor="option2">
            <div className="radio-img" />
            <input name="Wybór" type="radio" value="6m2" id="option2" ref={register({ required: true })} />
          </label>
          <label htmlFor="option3">
            <div className="radio-img" />
            <input name="Wybór" type="radio" value="9m2" id="option3" ref={register({ required: true })} />
          </label>
          <label htmlFor="option4">
            <div className="radio-img" />
            <input name="Wybór" type="radio" value="12m2" id="option4" ref={register({ required: true })} />
          </label>
        </div>

        <input type="submit" />
      </form>
    </FormContainer>
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
