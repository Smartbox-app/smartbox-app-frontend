import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import ApiService from '../../../../../../services/api-service';
import { BoxMapRes, IStock } from 'smartbox-types';
import { Section, SimpleHeader } from '../../../../../../components/Layout';
import { Spinner } from '../../../../../../components/Branded';
import { SingleBox } from './SingleBox';
import styled, { css } from 'styled-components';
import { MapSettingsForm } from './MapSettingsForm';

const StyledMapContainer = styled.div<{ height: number, width: number, background: string, stockId: string }>`
position: relative;
height: ${props => props.height}px;
width: ${props => props.width}px;
overflow: auto;
border: 1px solid ${props => props.theme.colors.primary};
${props => props.background && css`
    background-image: url(${ApiService.url}stock/background/${props.stockId});
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    `}
background-color: #fff;`

const Map = () => {
    const { stockId } = useParams<{ stockId: string }>();
    const [stock, setStock] = useState<IStock>();
    const [boxes, setBoxes] = useState<BoxMapRes[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const getBoxes = async () => {
        await ApiService.callFetch('GET', `box/all/${stockId}`, (data: BoxMapRes[]) => {
            setBoxes(data);
        })
        setLoading(false);

    }

    const getStock = async () => {
        await ApiService.callFetch('GET', `stock/${stockId}`, (res: IStock) => {
            setStock(res);
        })
    }

    useEffect(() => {
        getStock();
        getBoxes();
    }, [])

    if (loading || !stock) return <Spinner />

    return <Section full>
        <SimpleHeader title='application.map' />
        <MapSettingsForm stock={stock} refreshStock={getStock} />
        <StyledMapContainer height={stock.mapHeight} width={stock.mapWidth} background={stock.mapBackground} stockId={stockId}>
            {boxes.map(box => <SingleBox box={box} key={box.id} />)}
        </StyledMapContainer>
    </Section>
}

export { Map }