import React from 'react';
import { useForm } from 'react-hook-form';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { order } from '../../../../../actions';
import { FormContainer, ButtonsContainer } from '../../../../../components/Layout';

import './StepOne.scss';
import { Button } from '../../../../../components/Common';

interface Props {
  history: any;
  UpdateFormData: (data: any) => void;
  FormGoNextStep: (data: number) => void;
}

const Step1 = ({ history, UpdateFormData, FormGoNextStep }: any) => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log('StepOne', data);
    UpdateFormData(data);
    FormGoNextStep(2);
    history.push('/admin/order/step2');
  };

  return (
    <FormContainer className="step-one-wrapper">
      <h2>Step 1 - totaj pojawi się radio input z rodzajami</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="options-wrapper">
          <label htmlFor="option1">
            <div className="radio-img" />
            <input name="Wybór" type="radio" value="3" id="option1" ref={register({ required: true })} />
          </label>
          <label htmlFor="option2">
            <div className="radio-img" />
            <input name="Wybór" type="radio" value="6" id="option2" ref={register({ required: true })} />
          </label>
          <label htmlFor="option3">
            <div className="radio-img" />
            <input name="Wybór" type="radio" value="9" id="option3" ref={register({ required: true })} />
          </label>
          <label htmlFor="option4">
            <div className="radio-img" />
            <input name="Wybór" type="radio" value="12" id="option4" ref={register({ required: true })} />
          </label>
        </div>

        <ButtonsContainer max>
          <Button disabled text="Wróć" to="/admin/order/step1" />
          <Button type="submit" primary text="Dalej" />
        </ButtonsContainer>
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
