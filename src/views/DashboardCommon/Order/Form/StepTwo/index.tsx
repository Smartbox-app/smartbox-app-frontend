import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { addDays, differenceInCalendarDays } from 'date-fns';
import { DateInput, Button } from '../../../../../components/Common';
import { order } from '../../../../../actions';
import { ButtonsContainer } from '../../../../../components/Layout';
import { history } from '../../../../../App';
import { Form } from '../../../../../reducers/order-reducer';

import Price from './Price';

import './StepTwo.scss';

interface Props {
  history: any;
  formData: Form;
  countedPrice: number;
  UpdateFormData: (data: any) => void;
  FormGoNextStep: (data: number) => void;
}

const StepTwo = ({ formData, countedPrice, UpdateFormData, FormGoNextStep }: Props) => {
  const [dateStartMin, setDateStart] = useState(new Date());
  const [dateEndMin, setDateEnd] = useState(addDays(new Date(), 13));

  const defaultValues = {
    dateStart: formData.dateStart,
    dateEnd: formData.dateEnd,
  };

  const { register, handleSubmit, watch, errors, control } = useForm({ defaultValues });

  const onSubmit = (data: any) => {
    UpdateFormData({ durationInDays: differenceInCalendarDays(data.dateEnd, data.dateStart) });
    FormGoNextStep(3);
    history.push('/admin/order/step/3');
  };

  const onBack = () => {
    FormGoNextStep(1);
    history.push('/admin/order/step/1');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-step-two">
      <div className="calendars-picker-wrapper">
        <Controller
          name="dateStart"
          control={control}
          as={DateInput}
          register={register}
          required
          label="Wybierz datę rozpoczęcia wynajmu:"
          minDate={dateStartMin}
          maxDate={addDays(new Date(), 7)}
          onChange={([selected]) => {
            // setDateStart(selected);
            setDateEnd(addDays(selected, 13));
            return selected;
          }}
        />
        <Controller
          name="dateEnd"
          control={control}
          as={DateInput}
          register={register}
          required
          label="Wybierz datę zakończenia wynajmu:"
          minDate={dateEndMin}
          onChange={([selected]) => {
            // setDateEnd(selected);
            UpdateFormData({ durationInDays: differenceInCalendarDays(selected, dateStartMin) });
            return selected;
          }}
        />
      </div>
      <Price countedPrice={countedPrice} />
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
