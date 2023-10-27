import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import ApiService from '../../../../../services/api-service';
import { BoxMapRes } from 'smartbox-types';
import { Section, SimpleHeader } from '../../../../../components/Layout';
import { Spinner } from '../../../../../components/Branded';
import { SingleBox } from './SingleBox';
import styled from 'styled-components';

const StyledMapContainer = styled.div`
position: relative;
height: 600px;
background: #fff;`

const Map = () => {
    const { stockId } = useParams<{ stockId: string }>();

    const [boxes, setBoxes] = useState<BoxMapRes[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const getBoxes = async () => {
        await ApiService.callFetch('GET', `box/all/${stockId}`, (data: BoxMapRes[]) => {
            setBoxes(data);
        })
        setLoading(false);

    }

    useEffect(() => {
        getBoxes()
    }, [])

    if (loading) return <Spinner />

    return <Section full>
        <SimpleHeader title='application.map' />
        <StyledMapContainer>
            {boxes.map(box => <SingleBox box={box} key={box.id} />)}
        </StyledMapContainer>
    </Section>
}

export { Map }