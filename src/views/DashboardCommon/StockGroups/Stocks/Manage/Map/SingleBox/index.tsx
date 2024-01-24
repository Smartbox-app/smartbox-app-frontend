import React, { useState } from 'react';
import { BoxMapRes, IStock, RentStatus } from 'smartbox-types';
import ApiService from '../../../../../../../services/api-service';
import styled, { css } from 'styled-components';
import { Rnd } from 'react-rnd';
import { useDispatch } from 'react-redux';
import BoxDetail from '../../../../../../../views/DashboardCommon/BoxMapManagement/BoxDetail';
import { showModal } from '../../../../../../../actions/modal';

interface Props {
    box: BoxMapRes;
    stock: IStock;
    admin?: boolean;
    onBoxClick?: (box: BoxMapRes) => void;
}

const commonStyles = css`
display: flex;
color: ${props => props.theme.colors.primary};
font-weight: 500;
font-size: 0.8rem;
cursor: pointer;

background: #fff;
border: 1px solid ${props => props.theme.colors.primary};
`

const StyledDraggableBox = styled(Rnd)`
${commonStyles}`

const StyledBox = styled.div<{ status: RentStatus }>`
${commonStyles}
color: #fff;
${props => (!props.status || props.status === RentStatus.free) && css`
background-color: ${props.theme.colors.success}`}
${props => props.status === RentStatus.reserved && css`
background-color: ${props.theme.colors.danger}`}
${props => props.status === RentStatus.rented && css`
background-color: ${props.theme.colors.danger}`}
${props => props.status === RentStatus.toExplain && css`
background-color: ${props.theme.colors.toExplain}`}
${props => props.status === RentStatus.toCheck && css`
background-color: ${props.theme.colors.primary}`}
${props => props.status === RentStatus.noPaidExtension && css`
background-color: ${props.theme.colors.tertiary}`}
${props => props.status === RentStatus.outOfService && css`
background-color: ${props.theme.colors.disabled}`}

`

const StyledContent = styled.div`
height: 100%;
width: 100%;
display: flex;
align-items: center;
justify-content: center;

`

const SingleBox = ({ box, stock, admin, onBoxClick }: Props) => {
    const normalizePosition = (position: number) => {
        const rest = position % 5;
        return rest > 2 ? position + (5 - rest) : position - rest;
    }

    const normalizeWidth = (box: BoxMapRes) => {
        if (box.width) return box.width;
        if (!box.groupWidth) return 50;
        const ratio = stock.mapWidth / stock.mapWidthMeters;
        return Math.round(box.groupWidth * ratio);
    }

    const normalizeHeight = (box: BoxMapRes) => {
        if (box.height) return box.height;
        if (!box.groupHeight) return 50;
        const ratio = stock.mapHeight / stock.mapHeightMeters;
        return Math.round(box.groupHeight * ratio);
    }

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
        updateSize(parseInt(ref.style.width), parseInt(ref.style.height));
    }

    const handleBoxDetails = () => {
        if (!onBoxClick) return;
        onBoxClick(box);
    }

    if (admin) return <StyledBox status={box.status} style={{
        position: 'absolute',
        left: normalizePosition(box.x || 0), top: normalizePosition(box.y || 0), width: normalizeWidth(box), height: normalizeHeight(box)
    }}
        onClick={handleBoxDetails}
    >
        <StyledContent>{box.identifier}</StyledContent></StyledBox>

    return <StyledDraggableBox
        disabledDragging={true}
        resizeGrid={[5, 5]}
        dragGrid={[5, 5]}
        onDragStop={handleDrop}
        onResizeStop={handleResize}
        default={{ x: normalizePosition(box.x || 0), y: normalizePosition(box.y || 0), width: normalizeWidth(box), height: normalizeHeight(box) }} bounds="parent">
        <StyledContent>{box.identifier}</StyledContent>
    </StyledDraggableBox>
}

export { SingleBox }