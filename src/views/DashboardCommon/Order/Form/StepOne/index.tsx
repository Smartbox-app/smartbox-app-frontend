import React from 'react';
import { useForm } from 'react-hook-form';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { order } from '../../../../../actions';
import { FormContainer, ButtonsContainer } from '../../../../../components/Layout';

import './StepOne.scss';
import { Button } from '../../../../../components/Common';
import SingleOption from './SingleOption';
import { history } from '../../../../../App';

interface RouteProps {
  step: string;
}

interface RouteComponentProps<RouteProps> {
  history: any;
  UpdateFormData: (data: any) => void;
  FormGoNextStep: (data: number) => void;
}

const Step1 = ({ history, UpdateFormData, FormGoNextStep, match }: any) => {
  const { register, handleSubmit, watch } = useForm();
  console.log('step1', match);

  const onSubmit = (data: any) => {
    console.log('StepOne', data);
    UpdateFormData(data);
    FormGoNextStep(2);
    history.push('/admin/order/step/2');
  };

  console.log(watch('choose'));

  return (
    <FormContainer className="step-one-wrapper">
      <h2>Step 1 - totaj pojawi się radio input z rodzajami</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="options-wrapper">
          <SingleOption key={1} name="choose" value="1" id="option1" refOption={{ required: true }} />
          <SingleOption key={2} name="choose" value="2" id="option2" refOption={{ required: true }} />
          <SingleOption key={3} name="choose" value="3" id="option3" refOption={{ required: true }} />
          <SingleOption key={4} name="choose" value="4" id="option4" refOption={{ required: true }} />
        </div>

        <ButtonsContainer max>
          <Button disabled text="Wróć" />
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
