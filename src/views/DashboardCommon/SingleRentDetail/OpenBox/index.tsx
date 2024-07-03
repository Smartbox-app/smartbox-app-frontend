import React, { useState } from 'react';
import { Button } from "../../../../components/Branded";
import { ButtonsContainer } from '../../../../components/Layout';
import styled from 'styled-components';
import ApiService from '../../../../services/api-service';

interface Props {
    id: string;
}

const StyledContainer = styled.div`
display: flex;
justify-content: center;`

export const OpenBox = ({ id }: Props) => {
    const [isOpening, setIsOpening] = useState(false);
    const openBox = async () => {
        setIsOpening(true);
        await ApiService.callFetch('GET', `box/open/${id}`, (res) => {
            console.log(res);
        })
        setIsOpening(false);
    }

    return <StyledContainer><Button big primary disabled={isOpening} text="application.openBox" click={openBox} /></StyledContainer>
}