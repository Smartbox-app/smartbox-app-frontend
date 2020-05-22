import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { UserRes, BoxGroupAvailability } from 'smartbox-types';
import { order } from '../../../../../actions';
import { FormContainer, ButtonsContainer } from '../../../../../components/Layout';
import { Button } from '../../../../../components/Common';
import SingleOption, { SingleOptionType } from './SingleOption';
import { Form } from '../../../../../reducers/order-reducer';
import { ApplicationState } from '../../../../../reducers';

import FormHeader from '../../../../../components/Layout/FormHeader';
import UserService from '../../../../../services/user-service';

import './StepSize.scss';

interface RouteProps {
  step: string;
}

interface Props extends RouteComponentProps<RouteProps> {
  history: any;
  formData: Form;
  user: UserRes;
  boxAvailability: BoxGroupAvailability[];
  UpdateFormData: (data: any) => void;
  FormGoNextStep: (data: number) => void;
  fetchBoxAvailability: () => void;
}

const StepSize = ({
  history,
  UpdateFormData,
  FormGoNextStep,
  match,
  fetchBoxAvailability,
  formData,
  user,
  boxAvailability,
}: Props) => {
  useEffect(() => {
    fetchBoxAvailability();
  }, []);

  const defaultValues = {
    size: formData.size,
  };

  const { register, handleSubmit, watch } = useForm({ defaultValues });

  const onSubmit = (data: any) => {
    UpdateFormData(data);
    FormGoNextStep(2);
    history.push(`/${UserService.getSlugByRole(user.role)}/order/step/2`);
  };

  const boxList: SingleOptionType[] = [
    {
      name: 'size',
      value: 3,
      id: 'option3',
      sizeX: 1,
      sizeY: 1,
      sizeZ: 2.6,
      imgAddress: '/assets/images/dummy_box2.png',
    },
    {
      name: 'size',
      value: 6,
      id: 'option6',
      sizeX: 1,
      sizeY: 1,
      sizeZ: 2.6,
      imgAddress: '/assets/images/dummy_box2.png',
    },
    {
      name: 'size',
      value: 9,
      id: 'option9',
      sizeX: 1,
      sizeY: 1,
      sizeZ: 2.6,
      imgAddress: '/assets/images/dummy_box2.png',
    },
    {
      name: 'size',
      value: 12,
      id: 'option12',
      sizeX: 1,
      sizeY: 1,
      sizeZ: 2.6,
      imgAddress: '/assets/images/dummy_box2.png',
    },
  ];

  const isThisBoxAvailability = (boxSize: number) => {
    if (boxSize === 12) {
      return true;
    }
    return false;
  };

  const options = boxList.map((data: SingleOptionType, index: number) => (
    <SingleOption key={index} singleOptionData={data} register={register} disable={isThisBoxAvailability(data.value)} />
  ));

  return (
    <FormContainer className="step-size-wrapper">
      {console.log('boxAvailability', boxAvailability)}
      <FormHeader title="Proszę wybrać rozmiar magazynu:" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="options-wrapper">{options}</div>

        <ButtonsContainer max>
          <Button disabled text="Wróć" />
          <Button type="submit" primary text="Dalej" disabled={watch().size === ''} />
        </ButtonsContainer>
      </form>
    </FormContainer>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  formData: state.order.formData,
  countedPrice: state.order.countedPrice,
  user: state.user.details,
  boxAvailability: state.order.boxAvailability,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...order,
    },
    dispatch,
  );

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(StepSize));
