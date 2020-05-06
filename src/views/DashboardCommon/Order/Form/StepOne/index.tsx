import React, { useEffect } from 'react';
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
  fetchBoxAvailability: () => void;
}

const Step1 = ({ history, UpdateFormData, FormGoNextStep, match, fetchBoxAvailability }: any) => {
  useEffect(() => {
    fetchBoxAvailability();
  });

  const { register, handleSubmit, watch } = useForm();

  const onSubmit = (data: any) => {
    console.log('StepOne', data);
    UpdateFormData(data);
    FormGoNextStep(2);
    history.push('/admin/order/step/2');
  };

  return (
    <FormContainer className="step-one-wrapper">
      <h3>Proszę wybrać rozmiar magazynu:</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="options-wrapper">
          <SingleOption
            key={1}
            name="choose"
            value="3"
            id="option1"
            imgAddress="/assets/images/dummy_box2.png"
            sizeX={1}
            sizeY={1}
            sizeZ={2.6}
            register={register}
          />
          <SingleOption
            key={2}
            name="choose"
            value="6"
            id="option2"
            imgAddress="/assets/images/dummy_box2.png"
            sizeX={1}
            sizeY={1}
            sizeZ={2.6}
            register={register}
          />
          <SingleOption
            key={3}
            name="choose"
            value="9"
            id="option3"
            imgAddress="/assets/images/dummy_box2.png"
            sizeX={1}
            sizeY={1}
            sizeZ={2.6}
            register={register}
          />
          <SingleOption
            key={4}
            name="choose"
            value="12"
            id="option4"
            imgAddress="/assets/images/dummy_box2.png"
            sizeX={1}
            sizeY={1}
            sizeZ={2.6}
            register={register}
          />
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
