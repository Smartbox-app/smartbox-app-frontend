import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { withRouter } from 'react-router-dom';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { DateInput, Button } from '../../../../../components/Common';
import { order } from '../../../../../actions';
import { ButtonsContainer } from '../../../../../components/Layout';
import { formatPrice } from '../../../../../utils/format-price';
import { history } from '../../../../../App';

import './StepThree.scss';

interface Props {
  history: any;
  formData: {};
  countedPrice: number;
  UpdateFormData: (data: any) => void;
  FormGoNextStep: (data: number) => void;
}

const StepThree = (props: Props) => {
  const [date, setDate] = useState(new Date());

  const defaultValues = {
    dateStart: date,
    dateEnd: date,
  };

  const { register, handleSubmit, watch, errors, control } = useForm({ defaultValues });

  const onSubmit = (data: any) => {
    props.UpdateFormData(data);
    props.FormGoNextStep(4);
    history.push('/admin/order/step/4');
  };

  const onBack = () => {
    props.FormGoNextStep(2);
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
