import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import ApiService from '../../../../../../services/api-service';
import { BoxMapRes, IStock } from 'smartbox-types';
import { Section, SimpleHeader } from '../../../../../../components/Layout';
import { Spinner } from '../../../../../../components/Branded';
import { MapSettingsForm } from './MapSettingsForm';
import { MapView } from '../../../../MapView';

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
        <MapView stock={stock} boxes={boxes} />

    </Section>
}

export { Map }