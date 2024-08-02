import React, { useState } from 'react';
import { Button } from "../../../../components/Branded";
import styled from 'styled-components';
import ApiService from '../../../../services/api-service';
import { useDispatch } from 'react-redux';
import { errorNotificationText, successNotification } from '../../../../actions/notifications';

interface Props {
    id: string;
}

const StyledContainer = styled.div`
display: flex;
justify-content: center;`

export const OpenBox = ({ id }: Props) => {
    const [isOpening, setIsOpening] = useState(false);
    const dispatch = useDispatch();
    const openBox = async () => {
        setIsOpening(true);
        await ApiService.callFetch('GET', `box/open/${id}`, (isSuccess: boolean) => {
            if(isSuccess) {
                dispatch(successNotification('application.boxOpenedSuccessfully'));
            } else {
                dispatch(errorNotificationText('application.cannotOpenBox'));
            }
        })
        setIsOpening(false);
    }

    return <StyledContainer><Button big primary disabled={isOpening} text="application.openBox" click={openBox} /></StyledContainer>
}