import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { withRouter } from 'react-router-dom';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button } from '../../../../../components/Common';
import { order } from '../../../../../actions';
import { ButtonsContainer } from '../../../../../components/Layout';
import { history } from '../../../../../App';
import { Form } from '../../../../../reducers/order-reducer';

import './StepThree.scss';

interface Props {
  history: any;
  formData: Form;
  countedPrice: number;
  UpdateFormData: (data: any) => void;
  FormGoNextStep: (data: number) => void;
}

const StepThree = ({ formData, countedPrice, UpdateFormData, FormGoNextStep }: Props) => {
  useEffect(() => {
    if (formData.size.length === 0) {
      history.push('/admin/order/step/1');
    }
  });

  const [date, setDate] = useState(new Date());

  const defaultValues = {
    dateStart: date,
    dateEnd: date,
  };

  const { register, handleSubmit, watch, errors, control } = useForm({ defaultValues });

  const onSubmit = (data: any) => {
    UpdateFormData(data);
    FormGoNextStep(4);
    history.push('/admin/order/step/4');
  };

  const onBack = () => {
    FormGoNextStep(2);
    history.push('/admin/order/step/2');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-step-two">
      <h1>Tutaj powinno się pojawić podsumowanie</h1>
      <iframe title="reg">A tutaj będzie regulamin</iframe>
      <ButtonsContainer max>
        <Button outline text="Wróć" click={() => onBack()} />
        <Button type="submit" primary text="Dalej" />
      </ButtonsContainer>
    </form>
  );
};

const mapStateToProps = (state: any) => ({
  formData: state.order.formData,
  countedPrice: state.order.countedPrice,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...order,
    },
    dispatch,
  );

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(StepThree));
