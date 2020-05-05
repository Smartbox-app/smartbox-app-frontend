import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { DateInput, Button } from '../../../../../components/Common';
import { order } from '../../../../../actions';
import { ButtonsContainer } from '../../../../../components/Layout';

import './StepTwo.scss';
import { formatThousands, formatPrice } from '../../../../../utils/format-price';

interface Props {
  formData: {};
  countedPrice: number;
  UpdateFormData: (data: any) => void;
  FormGoNextStep: (data: number) => void;
}

const StepTwo = (props: Props) => {
  const [date, setDate] = useState(new Date());

  console.log('StepTwo', props.formData);

  const defaultValues = {
    dateStart: date,
    dateEnd: date,
  };

  const { register, handleSubmit, watch, errors, control } = useForm({ defaultValues });

  const onSubmit = (data: any) => console.log('onSubmit', data);
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
        <Button outline text="Wróć" to="/admin/order/" />
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

export default connect(mapStateToProps, mapDispatchToProps)(StepTwo);
