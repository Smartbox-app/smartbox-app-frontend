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

import './StepTwo.scss';

interface Props {
  history: any;
  formData: {};
  countedPrice: number;
  UpdateFormData: (data: any) => void;
  FormGoNextStep: (data: number) => void;
}

const StepTwo = (props: Props) => {
  const [date, setDate] = useState(new Date());

  const defaultValues = {
    dateStart: date,
    dateEnd: date,
  };

  const { register, handleSubmit, watch, errors, control } = useForm({ defaultValues });

  const onSubmit = (data: any) => {
    props.UpdateFormData(data);
    props.FormGoNextStep(3);
    history.push('/admin/order/step3');
  };

  const onBack = () => {
    props.FormGoNextStep(1);
    history.push('/admin/order');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-step-two">
      <div className="calendars-picker-wrapper">
        <Controller
          name="dateStart"
          control={control}
          as={DateInput}
          register
          required
          value={date}
          errors={errors}
          label="Wybierz datę rozpoczęcia wynajmu"
        />
        <Controller
          name="dateEnd"
          control={control}
          as={DateInput}
          register
          required
          value={date}
          errors={errors}
          label="Wybierz datę rozpoczęcia wynajmu"
        />
      </div>
      <div className="price-wrapper">
        <p>Cena za wybrany okres to: {formatPrice(props.countedPrice)}</p>
      </div>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(StepTwo));
