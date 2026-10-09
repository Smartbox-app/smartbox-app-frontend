import React from 'react';
import { BoxDisplayStatus, BoxListRes, BoxStatus, RentStatus, StockRes } from "smartbox-types";
import styled, { css } from "styled-components";
import { translateBoxDisplayStatus } from "src/utils/box-display-status";

interface Props {
    box: BoxListRes;
    stock?: StockRes;
}

const StyledStatus = styled.div<{ status?: BoxDisplayStatus, stock?: StockRes }>`
border-radius: 2px;
font-weight: 700;
font-size: 0.8rem;
padding: 5px;
color: #fff;
${props => (!props.status || props.status === BoxStatus.free) && css`
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
${props => props.status === RentStatus.noPaidPeriod && css`
background-color: ${props.stock?.colorNoPaidPeriod}`};
${props => props.status === RentStatus.noPaidExtensionWithWarning && css`
background-color: ${props.stock?.colorNoPaidExtensionWithWarning}`};
${props => props.status === BoxStatus.outOfService && css`
background-color: ${props.stock?.colorOutOfService}`};
${props => props.status === RentStatus.finished && css`
background-color: ${props.stock?.colorFinished}`};
${props => props.status === RentStatus.failure && css`
background-color: ${props.stock?.colorFailure}`};
${props => (props.status === RentStatus.pendingFinish || props.status === RentStatus.awaitingFinish) && css`
background-color: ${props.stock?.colorPendingFinish}`};
${props => props.status === RentStatus.endedUnpaid && css`
background-color: ${props.stock?.colorNoPaidPeriod}`};
`

const BoxStatusBadge = ({ box, stock }: Props) => {
    return (
      <StyledStatus stock={stock} status={box.status}>
        {translateBoxDisplayStatus(box.status)}
      </StyledStatus>
    );
}

export { BoxStatusBadge as BoxStatus }
