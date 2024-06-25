import React from 'react';
import { Button } from "../../../../components/Branded";
import { ButtonsContainer } from '../../../../components/Layout';
import styled from 'styled-components';

interface Props {
    id: string;
}

const StyledContainer = styled.div`
display: flex;
justify-content: center;`

export const OpenBox = ({ id }: Props) => {
    return <StyledContainer><Button big primary text="application.openBox" click={() => { }} /></StyledContainer>
}