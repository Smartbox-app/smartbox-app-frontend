import React, { useEffect, useMemo, useState } from 'react';
import { useForm, Controller, FormContext } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect, useDispatch, useSelector } from 'react-redux';

import { addDays, endOfDay, startOfDay, startOfToday } from 'date-fns';
import { MyRentDetails, MyRentList, UserRes } from 'smartbox-types';
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
import { calculateAddonPrice, calculatePriceForRent, clearAddonPrice, setRentEndDate, setRentStartDate } from '../../../../../actions/order';
import { Addons } from '../Common/Addons';
import ApiService from '../../../../../services/api-service';
import { getColorForBackground } from '../../../../../utils/color';

const StyledCalendarPicker = styled.div`
margin: 0 -10px;
.flatpickr-day {
    &.today {
border-color: ${props => props.theme.colors.primary};
    }

    &.selected {
        border-color: ${props => props.theme.colors.primary};
        background-color: ${props => props.theme.colors.primary};
        color: ${props => getColorForBackground(props.theme.colors.primary)};
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

const StepExtensionDuration = ({
    clearPaymentDetails,
    user,
}: Props) => {
    const dispatch = useDispatch();
    const { rentId, step } = useParams<{ step: string, rentId?: string }>();
    const [rent, setRent] = useState<MyRentDetails>();
    const minRentPeriod = useSelector((state: ApplicationState) => state.order.minRentPeriod);
    // box groupId is used directly only when new rent is created
    const { startDate, endDate, loadingPrice, orderAddons, orderAddonsId } = useSelector((state: ApplicationState) => state.order);
    const [loading, setLoading] = useState<boolean>(false);

    // get rent details if it is extended
    const getSingleRent = async () => {
        setLoading(true);
        await ApiService.callFetch('GET', `rent/my-details/${rentId}`, (data: MyRentDetails) => {
            setRent(data);
        });
        setLoading(false);
    }


    useEffect(() => {
        if (!rentId) return;

        getSingleRent();
    }, [rentId])

    useEffect(() => {
        if (!rent) return;
        dispatch(setRentStartDate(addDays(startOfDay(new Date(rent.finishAt)), 1)));
        dispatch(setRentEndDate(addDays(startOfDay(new Date(rent.finishAt)), 1 + minRentPeriod)));
    }, [rent])

    useEffect(() => {
        if (!rentId) return;
        setLoading(true);
        dispatch(calculatePriceForRent(rentId, startDate, endDate));
        calculateAllAddons();
    }, [startDate, endDate, rentId]);

    useEffect(() => {
        calculateAllAddons();
    }, [orderAddonsId])

    const calculateAllAddons = () => {
        Object.keys(orderAddons).forEach(addonId => {
            const addon = orderAddons[addonId];
            if (addon.selectedVariant) dispatch(calculateAddonPrice(addonId, startDate, endDate, addon.selectedVariant));
            else dispatch(clearAddonPrice(addonId))
        })

    }

    const setMinDate = (addAmount = 0, end?: boolean) => {
        if (!rent) return;
        return addDays(startOfDay(new Date(rent.finishAt)), addAmount);
    }


    const setMaxDateToExtend = () => {
        if (!rent) return;
        return addDays(endOfDay(new Date(rent.finishAt)), minRentPeriod);
    }

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

    const allRequiredAddonsSelected = useMemo(() => {
        const addonIds = Object.keys(orderAddons);

        for (let addonId of addonIds) {
            const orderAddon = orderAddons[addonId];
            if (orderAddon.required && !orderAddon.selectedVariant) return false;

            for (let acceptance of orderAddon.acceptances) {
                if (orderAddon.selectedVariant && acceptance && acceptance.required && !orderAddon.acceptancesStatus[acceptance.id].accepted) return false;
            }
        }

        return true;
    }, [orderAddons])

    if (!user) return null;

    if (!rent) return <Spinner overlay />

    return (
        <form className="form-step-two">
            {loadingPrice && <Spinner halfTransparent overlay />}
            <StyledCalendarPicker className="calendars-picker-wrapper">
                <DateInput
                    name='endDate'
                    // register={register({ required: true })}
                    label='application.selectEndRentDate'
                    minDate={setMinDate(minRentPeriod, true)}
                    value={endDate}
                    onChange={([selected]) => {
    
                        dispatch(setRentEndDate(selected))
                        // updateFormData({
                        //     durationInDays: differenceInCalendarDays(selected[0], formData.dateStart),
                        //     dateEnd: selected[0],
                        //     isFirstRent: firstRentChecker(user),
                        // });
                        // return selected;
                    }}
                />
            </StyledCalendarPicker>

            <Addons stockId={rent.stockId} />

            <Price />
            <ButtonsContainer max>
                <Button to={`/${UserService.getSlugByRole(user.role)}/order/step/summary/${rentId}`} primary text='application.next' disabled={!allRequiredAddonsSelected} />
            </ButtonsContainer>
        </form>
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

export default connect(mapStateToProps, mapDispatchToProps)(StepExtensionDuration);
