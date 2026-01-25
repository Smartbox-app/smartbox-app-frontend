import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import ApiService from '../../../../../../services/api-service';
import { BoxMapRes, StockRes } from 'smartbox-types';
import { Section } from '../../../../../../components/Layout';
import { Spinner } from '../../../../../../components/Branded';
import { MapSettingsForm } from './MapSettingsForm';
import { MapView } from '../../../../MapView';
import { Header } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';

const Map = () => {
    const { stockId } = useParams<{ stockId: string }>();
    const [stock, setStock] = useState<StockRes>();
    const [boxes, setBoxes] = useState<BoxMapRes[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const getBoxes = async () => {
        await ApiService.callFetch('GET', `box/all/${stockId}`, (data: BoxMapRes[]) => {
            setBoxes(data);
        })
        setLoading(false);
    }

    const getStock = async () => {
        await ApiService.callFetch('GET', `stock/${stockId}`, (res: StockRes) => {
            setStock(res);
        })
    }

    useEffect(() => {
        getStock();
        getBoxes();
    }, [])

    if (loading || !stock) return <Spinner />

    return <Section>
        <Header variant='h2'>{__('application.map')}</Header>
        <MapSettingsForm stock={stock} refreshStock={getStock} />
        <MapView stock={stock} boxes={boxes} />

    </Section>
}

export { Map }