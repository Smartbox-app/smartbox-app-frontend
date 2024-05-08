import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BoxGroupUserRes } from 'smartbox-types';
import { FormContainer, ButtonsContainer } from '../../../../../components/Layout';
import { Button } from '../../../../../components/Branded';
import SingleOption from './SingleOption';
import { ApplicationState } from '../../../../../reducers';
import FormHeader from '../../../../../components/Layout/FormHeader';
import UserService from '../../../../../services/user-service';
import ApiService from '../../../../../services/api-service';

import './StepSize.scss';
import { Alert } from '../../../../../components/Common';

const StepSize = () => {
    const { stockId, boxGroupId } = useSelector((state: ApplicationState) => state.order);
    const user = useSelector((state: ApplicationState) => state.user.details!);

    const [boxGroups, setBoxGroups] = useState<BoxGroupUserRes[]>([]);

    useEffect(() => {
        ApiService.callFetch('GET', `box-group-new/all/${stockId}`, (boxes: BoxGroupUserRes[]) => {
            setBoxGroups(boxes);
        })
    }, [])

    const options = [...boxGroups].sort((a, b) => a.area && b.area ? a.area - b.area : a.name > b.name ? 1 : -1).map((data: BoxGroupUserRes, index: number) => (
        <SingleOption
            key={data.id}
            singleOptionData={data}
        />
    ));

    return (
        <FormContainer className="step-size-wrapper">
            <FormHeader no-margin title='application.orderFormPickSize' />
            <form>
                <div className="options-wrapper">{options}</div>
                {boxGroups.length === 0 && <Alert type='notice' text='application.noBoxesInThisStock' />}
                <ButtonsContainer max>
                    <Button text='application.back' to='/user/order/step/stock' />
                    <Button
                        type="submit"
                        primary
                        to={`/${UserService.getSlugByRole(user!.role)}/order/step/duration`}
                        text='application.next'
                        disabled={!boxGroupId}
                    />
                </ButtonsContainer>
            </form>
        </FormContainer>
    );
};

export default StepSize;
