import React from 'react';
import ApiService from "../../../services/api-service"
import styled, { css } from "styled-components"
import { SingleBox } from "../StockGroups/Stocks/Manage/Map/SingleBox"
import { MapGrid } from "../StockGroups/Stocks/Manage/Map/MapGrid"
import { BoxMapRes, BoxMapUserRes, IStock } from "smartbox-types";

interface Props {
    boxes: (BoxMapRes | BoxMapUserRes)[];
    stock: IStock;
    onBoxClick?: (box: BoxMapRes) => void;
    highlightId?: string;
    admin?: boolean;
    user?: boolean;
}

const StyledMapOuterContainer = styled.div`
overflow: auto;
width: 100%;
`

const StyledMapContainer = styled.div<{ height: number, width: number, background: string, stockId: string }>`
position: relative;
border: 1px solid ${props => props.theme.colors.primary};
height: ${props => props.height}px;
width: ${props => props.width}px;
overflow: hidden;
margin: 0 auto;
${props => props.background && css`
    background-image: url(${ApiService.url}stock/background/${props.stockId});
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    `}
background-color: #fff;`


const MapView = ({ boxes, stock, admin, user, highlightId, onBoxClick }: Props) => {
    return <StyledMapOuterContainer>
        <StyledMapContainer height={stock.mapHeight} width={stock.mapWidth} background={stock.mapBackground} stockId={stock.id}>
            {!admin && <MapGrid height={stock.mapHeight} width={stock.mapWidth} />}
            {boxes.map(box => <SingleBox box={box} highlightId={highlightId} key={box.id} stock={stock} admin={admin} user={user} onBoxClick={onBoxClick} />)}
        </StyledMapContainer>
    </StyledMapOuterContainer>
}

export { MapView }