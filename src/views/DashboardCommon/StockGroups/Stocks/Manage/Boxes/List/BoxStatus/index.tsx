import React from 'react';
import { BoxListRes, RentStatus } from "smartbox-types";
import styled, { css } from "styled-components";

interface Props {
    box: BoxListRes;
}

const StyledStatus = styled.div<{ status?: RentStatus }>`
border-radius: 2px;
font-weight: 700;
font-size: 0.8rem;
padding: 5px;
color: #fff;
${props => (!props.status || props.status === RentStatus.free) && css`
background-color: ${props.theme.colors.success}`};
${props => props.status === RentStatus.reserved && css`
background-color: ${props.theme.colors.danger}`};
${props => props.status === RentStatus.rented && css`
background-color: ${props.theme.colors.danger}`};
${props => props.status === RentStatus.toExplain && css`
background-color: ${props.theme.colors.toExplain}`};
${props => props.status === RentStatus.toCheck && css`
background-color: ${props.theme.colors.primary}`};
${props => props.status === RentStatus.noPaidExtension && css`
background-color: ${props.theme.colors.tertiary}`};
${props => props.status === RentStatus.outOfService && css`
background-color: ${props.theme.colors.disabled}`};`

const BoxStatus = ({ box }: Props) => {
    return <StyledStatus status={box.status}>{box.status || RentStatus.free}</StyledStatus>
}

export { BoxStatus }