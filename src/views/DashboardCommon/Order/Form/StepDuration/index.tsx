import React, { useEffect } from 'react';
import { useForm, Controller, FormContext } from 'react-hook-form';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { addDays, differenceInCalendarDays, endOfDay, startOfDay, startOfToday } from 'date-fns';
import { IPricingResult, MyRentList, StockList, UserRes } from 'smartbox-types';
import { DateInput, Button } from '../../../../../components/Common';
import { order } from '../../../../../actions';
import { ButtonsContainer } from '../../../../../components/Layout';
import { history } from '../../../../../App';
import { FormType } from '../../../../../types/order-form';
import { ApplicationState } from '../../../../../reducers';
import UserService from '../../../../../services/user-service';
import { __ } from '../../../../../helpers/i18n';
import { firstRentChecker } from '../../../../../utils/isFirstRent';

import Price from './Price';

import './StepDuration.scss';

interface RouteProps {
  step: string;
  rentId: string;
}

interface Props extends RouteComponentProps<RouteProps> {
  history: any;
  formData: FormType;
  stockDiscount: StockList;
  countedPrice: IPricingResult;
  user: UserRes;
  rent: MyRentList;
  updateFormData: (data: any) => void;
  clearPaymentDetails: () => void;
}

const StepDuration = ({
  clearPaymentDetails,
  formData,
  countedPrice,
  updateFormData,
  user,
  match,
  rent,
  stockDiscount,
}: Props) => {
  const setMinDate = (addAmount = 0, end?: boolean) =>
    match.params.rentId
      ? addDays(startOfDay(new Date(rent.finishAt)), addAmount)
      : addDays(end ? formData.dateStart : startOfToday(), addAmount);

  const setMaxDateToExtend = () =>
    match.params.rentId ? addDays(endOfDay(new Date(rent.finishAt)), 0) : addDays(new Date(), 7);

  const defaultValues = {
    dateStart: match.params.rentId ? addDays(new Date(rent.finishAt), 0) : addDays(formData.dateStart, 0),
    dateEnd: match.params.rentId ? addDays(new Date(rent.finishAt), 7) : addDays(formData.dateEnd, 0),
  };

  useEffect(() => {
    clearPaymentDetails();
    if (formData.size === '') {
      history.push(`/${UserService.getSlugByRole(user.role)}/order/step/size`);
    } else if (match.params.rentId) {
      updateFormData({
        durationInDays: formData.durationInDays,
        dateStart: setMinDate(),
        dateEnd: setMinDate(formData.durationInDays),
        size: rent.size,
        isFirstRent: firstRentChecker(user),
        discount: stockDiscount.discount,
      });
    } else {
      updateFormData({
        durationInDays: formData.durationInDays,
        dateStart: setMinDate(),
        dateEnd: setMinDate(formData.durationInDays),
        isFirstRent: firstRentChecker(user),
        discount: stockDiscount.discount,
      });
    }
  }, []);

  const { register, handleSubmit, control } = useForm({ defaultValues });
  const methods = useForm();

  const onSubmit = () => {
    history.push(`/${UserService.getSlugByRole(user.role)}/order/step/summary/${match.params.rentId || ''}`);
  };

  const onBack = () => {
    history.push(`/${UserService.getSlugByRole(user.role)}/order/step/size/${match.params.rentId || ''}`);
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
            label={__('application.selectStartRentDate')}
            minDate={setMinDate()}
            maxDate={setMaxDateToExtend()}
            onChange={([selected]) => {
              updateFormData({
                durationInDays: differenceInCalendarDays(formData.dateEnd, selected[0]),
                dateStart: selected[0],
                isFirstRent: firstRentChecker(user),
              });
              return selected;
            }}
          />
          <Controller
            name="dateEnd"
            control={control}
            as={DateInput}
            register={register({ required: true })}
            label={__('application.selectEndRentDate')}
            minDate={setMinDate(7, true)}
            onChange={([selected]) => {
              updateFormData({
                durationInDays: differenceInCalendarDays(selected[0], formData.dateStart),
                dateEnd: selected[0],
                isFirstRent: firstRentChecker(user),
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
  stockDiscount: state.stock.list[0],
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
