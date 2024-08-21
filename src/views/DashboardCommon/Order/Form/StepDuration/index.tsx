import React, { useEffect, useMemo, useState } from 'react';
import { useForm, Controller, FormContext } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect, useDispatch, useSelector } from 'react-redux';

import { addDays, startOfToday } from 'date-fns';
import { MyRentList, UserRes } from 'smartbox-types';
import { DateInput } from '../../../../../components/Common';
import { Button, Spinner } from '../../../../../components/Branded';
import { order } from '../../../../../actions';
import { ButtonsContainer } from '../../../../../components/Layout';
import { FormType } from '../../../../../types/order-form';
import { ApplicationState } from '../../../../../reducers';
import UserService from '../../../../../services/user-service';

import Price from '../Common/Price';

import './StepDuration.scss';

import styled from 'styled-components';
import { calculateAddonPrice, calculatePrice, setRentEndDate, setRentStartDate } from '../../../../../actions/order';
import { Addons } from '../Common/Addons';

const StyledCalendarPicker = styled.div`
margin: 0 -10px;
.flatpickr-day {
    &.today {
border-color: ${props => props.theme.colors.primary};
    }

    &.selected {
        border-color: ${props => props.theme.colors.primary};
        background-color: ${props => props.theme.colors.primary};
    }
}
`


interface Props {
    history: any;
    formData: FormType;
    stockId: string;
    user: UserRes | null;
    rent: MyRentList;
    updateFormData: (data: Partial<FormType>) => void;
    clearPaymentDetails: () => void;
}

const StepDuration = ({
    clearPaymentDetails,
    user,
}: Props) => {
    const dispatch = useDispatch();
    const { step } = useParams<{ step: string, rentId?: string }>();
    const minRentPeriod = useSelector((state: ApplicationState) => state.order.minRentPeriod);
    // box groupId is used directly only when new rent is created
    const boxGroupId = useSelector((state: ApplicationState) => state.order.boxGroupId);
    const { stockId, startDate, endDate, loadingPrice, orderAddons, orderAddonsId } = useSelector((state: ApplicationState) => state.order);
    const [loading, setLoading] = useState<boolean>(false);



    useEffect(() => {
        setLoading(true);

        dispatch(calculatePrice(boxGroupId, startDate, endDate));

        calculateAllAddons();
    }, [startDate, endDate]);

    useEffect(() => {
        calculateAllAddons();
    }, [orderAddonsId])

    const calculateAllAddons = () => {
        Object.keys(orderAddons).forEach(addonId => {
            const addon = orderAddons[addonId];
            if (addon.selectedVariant) dispatch(calculateAddonPrice(addonId, startDate, endDate, addon.selectedVariant));
        })

    }

    const setMinDate = (addAmount = 0, end?: boolean) => addDays(end ? startDate : startOfToday(), addAmount);

    const setMaxDateToExtend = () => addDays(new Date(), minRentPeriod);

    const defaultValues = {
        dateStart: addDays(startDate, 0),
        dateEnd: addDays(endDate, 0),
    };


    useEffect(() => {
        if (!user) return;
        clearPaymentDetails();
        // const discount = stocks.find(stock => stock.id === formData.stock)?.discount;

        // @TODO: handle
        // if (match.params.rentId) {
        //     updateFormData({
        //         durationInDays: formData.durationInDays,
        //         dateStart: setMinDate(),
        //         dateEnd: setMinDate(formData.durationInDays),
        //         size: rent.size.toString(),
        //         isFirstRent: firstRentChecker(user),
        //         discount: discount,
        //     });
        // } else {
        //     updateFormData({
        //         durationInDays: formData.durationInDays,
        //         dateStart: setMinDate(),
        //         dateEnd: setMinDate(formData.durationInDays),
        //         isFirstRent: firstRentChecker(user),
        //         discount: discount,
        //     });
        // }
    }, []);

    const { register, control } = useForm({ defaultValues });
    const methods = useForm();

    const allRequiredAddonsSelected = useMemo(() => {
        const addonIds = Object.keys(orderAddons);

        for (let addonId of addonIds) {
            if (orderAddons[addonId].required && !orderAddons[addonId].selectedVariant) return false;
        }

        return true;
    }, [orderAddons])

    if (!user) return null;

    return (
        <FormContext {...methods}>
            <form className="form-step-two">
                {loadingPrice && <Spinner halfTransparent overlay />}
                <StyledCalendarPicker className="calendars-picker-wrapper">
                    <Controller
                        name="dateStart"
                        control={control}
                        as={DateInput}
                        register={register({ required: true })}
                        label='application.selectStartRentDate'
                        minDate={setMinDate()}
                        maxDate={setMaxDateToExtend()}
                        onChange={([selected]) => {
                            dispatch(setRentStartDate(selected[0]))
                            // updateFormData({
                            //     durationInDays: differenceInCalendarDays(formData.dateEnd, selected[0]),
                            //     dateStart: selected[0],
                            //     isFirstRent: firstRentChecker(user),
                            // });
                            // return selected;
                        }}
                    />
                    <Controller
                        name="dateEnd"
                        control={control}
                        as={DateInput}
                        register={register({ required: true })}
                        label='application.selectEndRentDate'
                        minDate={setMinDate(minRentPeriod, true)}
                        onChange={([selected]) => {
                            dispatch(setRentEndDate(selected[0]))
                            // updateFormData({
                            //     durationInDays: differenceInCalendarDays(selected[0], formData.dateStart),
                            //     dateEnd: selected[0],
                            //     isFirstRent: firstRentChecker(user),
                            // });
                            // return selected;
                        }}
                    />
                </StyledCalendarPicker>

                <Addons stockId={stockId} />

                <Price />
                <ButtonsContainer max>
                    <Button outline text='application.back' to={`/${UserService.getSlugByRole(user.role)}/order/step/stock`} />
                    <Button to={`/${UserService.getSlugByRole(user.role)}/order/step/summary`} primary text='application.next' disabled={!allRequiredAddonsSelected} />
                </ButtonsContainer>
            </form>
        </FormContext>
    );
};

const mapStateToProps = (state: ApplicationState) => ({
    formData: state.order.formData,
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

export default connect(mapStateToProps, mapDispatchToProps)(StepDuration);
