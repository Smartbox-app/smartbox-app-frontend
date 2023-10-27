import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { UserRes, BoxGroupAvailability, StockList } from 'smartbox-types';
import { order, stock } from '../../../../../actions';
import { FormContainer, ButtonsContainer } from '../../../../../components/Layout';
import { Button } from '../../../../../components/Branded';
import SingleOption from './SingleOption';
import { FormType } from '../../../../../types/order-form';
import { ApplicationState } from '../../../../../reducers';

import FormHeader from '../../../../../components/Layout/FormHeader';
import UserService from '../../../../../services/user-service';
import './StepStock.scss';

interface RouteProps {
    step: string;
}

interface Props extends RouteComponentProps<RouteProps> {
    history: any;
    formData: FormType;
    user: UserRes | null;
    boxAvailability: BoxGroupAvailability[];
    list: StockList[];
    clearOrderAgreement: () => void;
    updateFormData: (data: Partial<FormType>) => void;
    getStockList: () => void;
}

const StepSize = ({
    history,
    updateFormData,
    formData,
    user,
    list,
    clearOrderAgreement,
    getStockList
}: Props) => {
    useEffect(() => {
        if (!user) return;
        if (!formData.size) {
            history.push(`/${UserService.getSlugByRole(user.role)}/main`);
        }
        clearOrderAgreement();
    }, []);

    const defaultValues = {
        stock: formData.stock,
    };

    const { register, handleSubmit, watch } = useForm({ defaultValues });

    const onSubmit = async (data: Partial<FormType>) => {
        if (!user) return;
        const discount = list.find(stock => stock.id === data.stock)?.discount;
        updateFormData({ ...data, discount });
        await getStockList(); //waiting for fetch list with stock discount before load data to discount variable in next step
        history.push(`/${UserService.getSlugByRole(user.role)}/order/step/size`);
    };


    return (
        <FormContainer className="step-stock-wrapper">
            <FormHeader no-margin title='application.orderFormPickStock' />
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="stocks-wrapper">{
                    list.map(el => <SingleOption value={el.id} name={el.name} address={el.address} register={register} />)
                }</div>

                <ButtonsContainer max>
                    <Button disabled text='application.back' />
                    <Button
                        type="submit"
                        primary
                        text='application.next'
                        disabled={watch().stock === ''}
                    />
                </ButtonsContainer>
            </form>
        </FormContainer>
    );
};

const mapStateToProps = (state: ApplicationState) => ({
    formData: state.order.formData,
    countedPrice: state.order.countedPrice,
    user: state.user.details,
    boxAvailability: state.order.boxAvailability,
    list: state.stock.list
});

const mapDispatchToProps = (dispatch: any) =>
    bindActionCreators(
        {
            ...order,
            ...stock,
        },
        dispatch,
    );

const StepSizeWithRouter = withRouter(StepSize);
export default connect(mapStateToProps, mapDispatchToProps)(StepSizeWithRouter);
