import React, { useState, useEffect } from 'react';
import { useForm, Controller, FormContext } from 'react-hook-form';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { addDays, differenceInCalendarDays } from 'date-fns';
import { IPricingResult, MyRentList, UserRes } from 'smartbox-types';
import { DateInput, Button } from '../../../../../components/Common';
import { order } from '../../../../../actions';
import { ButtonsContainer } from '../../../../../components/Layout';
import { history } from '../../../../../App';
import { FormType } from '../../../../../types/order-form';
import { ApplicationState } from '../../../../../reducers';
import UserService from '../../../../../services/user-service';
import { __ } from '../../../../../helpers/i18n';

import Price from './Price';

import './StepDuration.scss';

interface RouteProps {
  step: string;
  rentId: string;
}

interface Props extends RouteComponentProps<RouteProps> {
  history: any;
  formData: FormType;
  countedPrice: IPricingResult;
  user: UserRes;
  rent: MyRentList;
  updateFormData: (data: any) => void;
}

const StepDuration = ({ formData, countedPrice, updateFormData, user, match, rent }: Props) => {
  const setMinDate = (addAmount = 0, end?: boolean) =>
    match.params.rentId
      ? addDays(new Date(rent.finishAt), addAmount)
      : addDays(end ? formData.dateStart : new Date(), addAmount);

  useEffect(() => {
    if (formData.size.length === 0) {
      history.push(`/${UserService.getSlugByRole(user.role)}/order/step/size`);
    }
    if (match.params.rentId) {
      console.log('match.params.rentId', match.params.rentId);
      updateFormData({
        durationInDays: 7,
        dateStart: setMinDate(),
        dateEnd: setMinDate(7),
        size: rent.size,
      });
    }
  }, []);

  const setMaxDateToExtend = () => (match.params.rentId ? addDays(new Date(rent.finishAt), 0) : addDays(new Date(), 7));

  const defaultValues = {
    dateStart: setMinDate(),
    dateEnd: setMinDate(7),
  };

  const { register, handleSubmit, control } = useForm({ defaultValues });
  const methods = useForm();

  const onSubmit = () => {
    history.push(`/${UserService.getSlugByRole(user.role)}/order/step/summary`);
  };

  const onBack = () => {
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
            minDate={setMinDate()}
            maxDate={setMaxDateToExtend()}
            onChange={([selected]) => {
              updateFormData({
                durationInDays: differenceInCalendarDays(formData.dateEnd, selected[0]),
                discount: 0,
                dateStart: selected[0],
                dateEnd: addDays(selected[0], 7),
              });
              return selected;
            }}
          />
          <Controller
            name="dateEnd"
            control={control}
            as={DateInput}
            register={register({ required: true })}
            label="Wybierz datę zakończenia wynajmu:"
            minDate={setMinDate(7, true)}
            onChange={([selected]) => {
              updateFormData({
                durationInDays: differenceInCalendarDays(selected[0], formData.dateStart),
                discount: 0,
                dateEnd: selected[0],
              });
              return selected;
            }}
          />
        </div>
        <Price countedPrice={countedPrice.value} />
        <ButtonsContainer max>
          <Button outline text={__('application.back')} click={() => onBack()} disabled={!!match.params.rentId} />
          <Button type="submit" primary text={__('application.next')} />
        </ButtonsContainer>
      </form>
    </FormContext>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  formData: state.order.formData,
  countedPrice: state.order.countedPrice,
  user: state.user.details,
  rent: state.rent.singleRent,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...order,
    },
    dispatch,
  );

const StepDurationWithRouter = withRouter(StepDuration);
export default connect(mapStateToProps, mapDispatchToProps)(StepDurationWithRouter);
