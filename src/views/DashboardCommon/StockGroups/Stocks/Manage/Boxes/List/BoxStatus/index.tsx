import React from 'react';
import { BoxListRes, IStock, RentStatus } from "smartbox-types";
import styled, { css } from "styled-components";

interface Props {
    box: BoxListRes;
    stock?: IStock;
}

const StyledStatus = styled.div<{ status?: RentStatus, stock?: IStock }>`
border-radius: 2px;
font-weight: 700;
font-size: 0.8rem;
padding: 5px;
color: #fff;
${props => (!props.status || props.status === RentStatus.free) && css`
background-color: ${props.stock?.colorFree}`};
${props => props.status === RentStatus.reserved && css`
background-color: ${props.stock?.colorReserved}`};
${props => props.status === RentStatus.rented && css`
background-color: ${props.stock?.colorRented}`};
${props => props.status === RentStatus.toExplain && css`
background-color: ${props.stock?.colorToExplain}`};
${props => props.status === RentStatus.toCheck && css`
background-color: ${props.stock?.colorToCheck}`};
${props => props.status === RentStatus.noPaidExtension && css`
background-color: ${props.stock?.colorNoPaidExtension}`};
${props => props.status === RentStatus.noPaidExtensionWithWarning && css`
background-color: ${props.stock?.colorNoPaidExtensionWithWarning}`};
${props => props.status === RentStatus.outOfService && css`
background-color: ${props.stock?.colorOutOfService}`};
${props => props.status === RentStatus.finished && css`
background-color: ${props.stock?.colorFinished}`};
${props => props.status === RentStatus.failure && css`
background-color: ${props.stock?.colorFailure}`};
`

const BoxStatus = ({ box, stock }: Props) => {
    return <StyledStatus stock={stock} status={box.status}>{box.status || RentStatus.free}</StyledStatus>
}

export { BoxStatus }