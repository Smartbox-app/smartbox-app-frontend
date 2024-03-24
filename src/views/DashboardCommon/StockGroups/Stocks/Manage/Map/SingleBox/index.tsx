import React, { useState } from 'react';
import { BoxMapRes, BoxMapUserRes, IStock, RentStatus } from 'smartbox-types';
import ApiService from '../../../../../../../services/api-service';
import styled, { css } from 'styled-components';
import { Rnd } from 'react-rnd';
import { useDispatch } from 'react-redux';
import BoxDetail from '../../../../../../../views/DashboardCommon/BoxMapManagement/BoxDetail';
import { showModal } from '../../../../../../../actions/modal';

interface Props {
    box: BoxMapRes | BoxMapUserRes;
    stock: IStock;
    highlightId?: string;
    admin?: boolean;
    user?: boolean;
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

const StyledBox = styled.div<{ status: RentStatus | null, stock: IStock, user?: boolean }>`
${commonStyles}
${props => props.status && css`color: #fff;`}

${props => (props.status === RentStatus.free) && css`
background-color: ${props.stock.colorFree}`};
${props => props.status === RentStatus.reserved && css`
background-color: ${props.stock.colorReserved}`};
${props => !props.user && props.status === RentStatus.rented && css`
background-color: ${props.stock.colorRented}`};
${props => props.status === RentStatus.toExplain && css`
background-color: ${props.stock.colorToExplain}`};
${props => props.status === RentStatus.toCheck && css`
background-color: ${props.stock.colorToCheck}`};
${props => props.status === RentStatus.noPaidExtension && css`
background-color: ${props.stock.colorNoPaidExtension}`};
${props => props.status === RentStatus.noPaidExtensionWithWarning && css`
background-color: ${props.stock.colorNoPaidExtensionWithWarning}`};
${props => props.status === RentStatus.outOfService && css`
background-color: ${props.stock.colorOutOfService}`};
${props => props.status === RentStatus.finished && css`
background-color: ${props.stock.colorFinished}`};
${props => props.status === RentStatus.failure && css`
background-color: ${props.stock.colorFailure}`};

${props => props.user && props.status && css`background-color: ${props.theme.colors.success}`}

`

const StyledContent = styled.div`
height: 100%;
width: 100%;
display: flex;
align-items: center;
justify-content: center;

`

const SingleBox = ({ box, stock, admin, user, highlightId, onBoxClick }: Props) => {
    const normalizePosition = (position: number) => {
        const rest = position % 5;
        return rest > 2 ? position + (5 - rest) : position - rest;
    }

    const normalizeWidth = (box: BoxMapRes | BoxMapUserRes) => {
        if (box.width) return box.width;
        if (!box.groupWidth) return 50;
        const ratio = stock.mapWidth / stock.mapWidthMeters;
        return Math.round(box.groupWidth * ratio);
    }

    const normalizeHeight = (box: BoxMapRes | BoxMapUserRes) => {
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
        if (!admin) return;
        onBoxClick(box as BoxMapRes);
    }

    const getBoxStatus = (box: BoxMapUserRes | BoxMapRes) => {
        if(user && highlightId === box.id) return RentStatus.rented;
        if(user) return null;
        return (box as BoxMapRes).status || RentStatus.free;
    }

    if (admin || user) return <StyledBox status={getBoxStatus(box)} user={user} stock={stock} style={{
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