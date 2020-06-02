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
import { __ } from '../../../../../helpers/i18n';

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
      sizeX: 3,
      sizeY: 2.3,
      sizeZ: 2.6,
      imgAddress: '/assets/images/dummy_box2.png',
    },
    {
      name: 'size',
      value: 6,
      id: 'option6',
      sizeX: 6,
      sizeY: 2.3,
      sizeZ: 2.6,
      imgAddress: '/assets/images/dummy_box2.png',
    },
    {
      name: 'size',
      value: 9,
      id: 'option9',
      sizeX: 9,
      sizeY: 2.3,
      sizeZ: 2.6,
      imgAddress: '/assets/images/dummy_box2.png',
    },
    {
      name: 'size',
      value: 12,
      id: 'option12',
      sizeX: 12,
      sizeY: 2.3,
      sizeZ: 2.6,
      imgAddress: '/assets/images/dummy_box2.png',
    },
  ];

  const isThisBoxAvailability = (boxSize: number) => {
    if (boxAvailability.length > 1) {
      const currentBox = boxAvailability.find((box: BoxGroupAvailability) => box.size === boxSize);
      return currentBox?.available;
    }
  };

  const options = boxList.map((data: SingleOptionType, index: number) => (
    <SingleOption
      key={index}
      singleOptionData={data}
      register={register}
      disable={!isThisBoxAvailability(data.value)}
    />
  ));

  return (
    <FormContainer className="step-size-wrapper">
      <FormHeader title={__('application.orderFormPickSize')} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="options-wrapper">{options}</div>

        <ButtonsContainer max>
          <Button disabled text={__('application.back')} />
          <Button type="submit" primary text={__('application.next')} disabled={watch().size === ''} />
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
