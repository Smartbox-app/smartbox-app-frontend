import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { order } from '../../../../../actions';
import { FormContainer, ButtonsContainer } from '../../../../../components/Layout';
import { Button } from '../../../../../components/Branded';
import SingleOption from './SingleOption';
import { ApplicationState } from '../../../../../reducers';

import FormHeader from '../../../../../components/Layout/FormHeader';
import UserService from '../../../../../services/user-service';
import './StepStock.scss';

const StepStock = () => {
    const dispatch = useDispatch();
    const stockId = useSelector((state: ApplicationState) => state.order.stockId);
    const list = useSelector((state: ApplicationState) => state.stock.list);
    const user = useSelector((state: ApplicationState) => state.user.details!);
    useEffect(() => {
        if (!user) return;
        // if (!formData.size) {
        //     history.push(`/${UserService.getSlugByRole(user.role)}/main`);
        // }
        dispatch(order.clearOrderAgreement());
    }, []);


    if (!user) return null;
    return (
        <FormContainer className="step-stock-wrapper">
            <FormHeader no-margin title='application.orderFormPickStock' />
            <form>
                <div className="stocks-wrapper">{
                    list.map(el => <SingleOption key={el.id} value={el.id} name={el.name} address={el.address} />)
                }</div>

                <ButtonsContainer max>
                    <Button disabled text='application.back' />
                    <Button
                        to={`/${UserService.getSlugByRole(user!.role)}/order/step/size`}
                        type="submit"
                        primary
                        text='application.next'
                        disabled={!stockId}
                    />
                </ButtonsContainer>
            </form>
        </FormContainer>
    );
};

export default StepStock;
