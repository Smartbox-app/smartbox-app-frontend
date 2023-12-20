import React, { useState } from 'react';
import { BoxMapRes } from 'smartbox-types';
import ApiService from '../../../../../../../services/api-service';
import styled from 'styled-components';
import { Rnd } from 'react-rnd';

interface Props {
    box: BoxMapRes
}

const StyledBox = styled(Rnd)`
display: flex;
color: ${props => props.theme.colors.primary};
font-weight: 500;
font-size: 0.8rem;
cursor: pointer;

background: #fff;
border: 2px solid ${props => props.theme.colors.primary}`

const StyledContent = styled.div`
height: 100%;
width: 100%;
display: flex;
align-items: center;
justify-content: center;
`

const SingleBox = ({ box }: Props) => {

    const updatePosition = async (x: number, y: number) => {
        await ApiService.callFetch('PATCH', `box/position/${box.id}`, () => { }, null, { x, y })
    }

    const updateSize = async (width: number, height: number) => {
        await ApiService.callFetch('PATCH', `box/size/${box.id}`, () => { }, null, { width, height })
    }

    const handleDrop = (e, ui) => {
        updatePosition(ui.x, ui.y);
    }

    const handleResize = (_, __, ref: HTMLElement) => {
        console.log(ref.style)
        updateSize(parseInt(ref.style.width), parseInt(ref.style.height));
    }

    return <StyledBox
        onDragStop={handleDrop}
        onResizeStop={handleResize}
        default={{ x: box.x || 0, y: box.y || 0, width: box.width || 50, height: box.height || 50 }} bounds="parent">
        <StyledContent>{box.identifier}</StyledContent>
    </StyledBox>
}

export { SingleBox }