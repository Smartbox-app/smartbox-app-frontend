import React, { useState, useEffect } from 'react';
import { useForm, Controller, FormContext } from 'react-hook-form';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { addDays, differenceInCalendarDays } from 'date-fns';
import { IPricingResult, UserRes } from 'smartbox-types';
import { DateInput, Button } from '../../../../../components/Common';
import { order } from '../../../../../actions';
import { ButtonsContainer } from '../../../../../components/Layout';
import { history } from '../../../../../App';
import { FormType } from '../../../../../types/order-form';
import { ApplicationState } from '../../../../../reducers';
import UserService from '../../../../../services/user-service';

import Price from './Price';

import './StepDuration.scss';

interface Props {
  history: any;
  formData: FormType;
  countedPrice: IPricingResult;
  user: UserRes;
  updateFormData: (data: any) => void;
  formGoNextStep: (data: number) => void;
}

const StepDuration = ({ formData, countedPrice, updateFormData, formGoNextStep, user }: Props) => {
  useEffect(() => {
    if (formData.size.length === 0) {
      history.push(`/${UserService.getSlugByRole(user.role)}/order/step/size`);
    }
  });

  const [dateStartMin, setDateStart] = useState(new Date());
  const [dateEndMin, setDateEnd] = useState(addDays(new Date(), 7));

  const defaultValues = {
    dateStart: formData.dateStart,
    dateEnd: formData.dateEnd,
  };

  const { register, handleSubmit, control } = useForm({ defaultValues });
  const methods = useForm();

  const onSubmit = (data: any) => {
    formGoNextStep(3);
    history.push(`/${UserService.getSlugByRole(user.role)}/order/step/summary`);
  };

  const onBack = () => {
    formGoNextStep(1);
    history.push(`/${UserService.getSlugByRole(user.role)}/order/step/size`);
  };

  return (
    <FormContext {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="form-step-two">
        <div className="calendars-picker-wrapper">
          <Controller
            name="dateStart"
            control={control}
            as={DateInput}
            register={register({ required: true })}
            label="Wybierz datę rozpoczęcia wynajmu:"
            minDate={addDays(new Date(), 0)}
            maxDate={addDays(new Date(), 7)}
            onChange={([selected]) => {
              setDateStart(selected[0]);
              updateFormData({ durationInDays: differenceInCalendarDays(dateEndMin, selected[0]), discount: 0 });
              return selected;
            }}
          />
          <Controller
            name="dateEnd"
            control={control}
            as={DateInput}
            register={register({ required: true })}
            label="Wybierz datę zakończenia wynajmu:"
            minDate={addDays(dateStartMin, 7)}
            onChange={([selected]) => {
              setDateEnd(selected[0]);
              updateFormData({ durationInDays: differenceInCalendarDays(selected[0], dateStartMin), discount: 0 });
              return selected;
            }}
          />
        </div>
        <Price countedPrice={countedPrice.value} />
        <ButtonsContainer max>
          <Button outline text="Wróć" click={() => onBack()} />
          <Button type="submit" primary text="Dalej" />
        </ButtonsContainer>
      </form>
    </FormContext>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(StepDuration));
