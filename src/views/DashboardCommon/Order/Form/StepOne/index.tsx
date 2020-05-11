import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { IUser } from 'smartbox-types';
import { order } from '../../../../../actions';
import { FormContainer, ButtonsContainer } from '../../../../../components/Layout';
import { Button } from '../../../../../components/Common';
import SingleOption from './SingleOption';
import { Form } from '../../../../../reducers/order-reducer';

import './StepOne.scss';
import FormHeader from '../../../../../components/Layout/FormHeader';
import UserService from '../../../../../services/user-service';

interface RouteProps {
  step: string;
}

interface Props extends RouteComponentProps<RouteProps> {
  history: any;
  formData: Form;
  user: IUser;
  UpdateFormData: (data: any) => void;
  FormGoNextStep: (data: number) => void;
  fetchBoxAvailability: () => void;
}

const Step1 = ({ history, UpdateFormData, FormGoNextStep, match, fetchBoxAvailability, formData, user }: Props) => {
  useEffect(() => {
    fetchBoxAvailability();
  });

  const defaultValues = {
    size: formData.size,
  };

  const { register, handleSubmit, watch } = useForm({ defaultValues });

  const onSubmit = (data: any) => {
    UpdateFormData(data);
    FormGoNextStep(2);
    history.push(`/${UserService.getSlugByRole(user.role)}/order/step/2`);
  };

  return (
    <FormContainer className="step-one-wrapper">
      <FormHeader title="Proszę wybrać rozmiar magazynu:" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="options-wrapper">
          <SingleOption
            key={1}
            name="size"
            value={3}
            id="option1"
            imgAddress="/assets/images/dummy_box2.png"
            sizeX={1}
            sizeY={1}
            sizeZ={2.6}
            register={register}
          />
          <SingleOption
            key={2}
            name="size"
            value={6}
            id="option2"
            imgAddress="/assets/images/dummy_box2.png"
            sizeX={1}
            sizeY={1}
            sizeZ={2.6}
            register={register}
          />
          <SingleOption
            key={3}
            name="size"
            value={9}
            id="option3"
            imgAddress="/assets/images/dummy_box2.png"
            sizeX={1}
            sizeY={1}
            sizeZ={2.6}
            register={register}
          />
          <SingleOption
            key={4}
            name="size"
            value={12}
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

const mapStateToProps = (state: any) => ({
  formData: state.order.formData,
  countedPrice: state.order.countedPrice,
  user: state.user.details,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...order,
    },
    dispatch,
  );

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Step1));
