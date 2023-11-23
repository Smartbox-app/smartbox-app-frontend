import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { UserRes, BoxGroupAvailability, BoxGroupUserRes } from 'smartbox-types';
import { order, stock } from '../../../../../actions';
import { FormContainer, ButtonsContainer } from '../../../../../components/Layout';
import { Button } from '../../../../../components/Branded';
import SingleOption, { SingleOptionType } from './SingleOption';
import { FormType } from '../../../../../types/order-form';
import { ApplicationState } from '../../../../../reducers';

import FormHeader from '../../../../../components/Layout/FormHeader';
import UserService from '../../../../../services/user-service';
import './StepSize.scss';
import ApiService from '../../../../../services/api-service';

interface RouteProps {
    step: string;
}

interface Props extends RouteComponentProps<RouteProps> {
    history: any;
    formData: FormType;
    user: UserRes | null;
    boxAvailability: BoxGroupAvailability[];
    updateFormData: (data: Partial<FormType>) => void;
    fetchBoxAvailability: (stockId: string) => void;
    getStockList: () => void;
}

const StepSize = ({
    history,
    updateFormData,
    fetchBoxAvailability,
    formData,
    user,
    boxAvailability,
    getStockList
}: Props) => {
    
    const stockId = formData.stock;

    const [boxGroups, setBoxGroups] = useState<BoxGroupUserRes[]>([]);

    useEffect(() => {
        if (!user) return;
        if (stockId && stockId !== '') {
            fetchBoxAvailability(stockId);
        } else {
            history.push(`/${UserService.getSlugByRole(user.role)}/main`);
        }
    }, []);

    const defaultValues = {
        size: formData.size,
    };

    const { register, handleSubmit, watch } = useForm({ defaultValues });

    const onSubmit = async (data: Partial<FormType>) => {
        if(!user) return;
        updateFormData(data);
        await getStockList(); //waiting for fetch list with stock discount before load data to discount variable in next step
        history.push(`/${UserService.getSlugByRole(user.role)}/order/step/duration`);
    };

    useEffect(() => {
        ApiService.callFetch('GET', `box-group-new/all/${stockId}`, (boxes: BoxGroupUserRes[]) => {
            setBoxGroups(boxes);
        })
    }, [])

    

    const isThisBoxAvailability = (boxSize: string) => {
        return true;
        if (boxAvailability.length > 1) {
            const currentBox = boxAvailability.find((box: BoxGroupAvailability) => box.size.toString() === boxSize);
            return currentBox?.available;
        }
    };

    const options = boxGroups.map((data: BoxGroupUserRes, index: number) => (
        <SingleOption
            key={index}
            singleOptionData={data}
            register={register}
            disable={!isThisBoxAvailability(data.id)}
        />
    ));

    const isMyBoxAvailable = (size: string | null) => {
        if (!size) return false;
        const box = boxAvailability.find((b: BoxGroupAvailability) => b.size.toString() === size);

        return box && box.available;
    };

    return (
        <FormContainer className="step-size-wrapper">
            <FormHeader no-margin title='application.orderFormPickSize' />
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="options-wrapper">{options}</div>

                <ButtonsContainer max>
                    <Button disabled text='application.back' />
                    <Button
                        type="submit"
                        primary
                        text='application.next'
                        disabled={!watch().size || !isMyBoxAvailable(watch().size)}
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
