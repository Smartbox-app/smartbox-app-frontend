import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import ApiService from '../../../../../../services/api-service';
import { BoxMapRes, StockRes } from 'smartbox-types';
import { Section } from '../../../../../../components/Layout';
import { Spinner } from '../../../../../../components/Branded';
import { MapView } from '../../../../MapView';
import { useDispatch } from 'react-redux';
import BoxDetail from '../../../../BoxDetail';
import { showModal } from '../../../../../../actions/modal';
import { Header } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { useTenantNaming } from 'src/hooks/useTenantNaming';

const Handling = () => {
    const { stockId } = useParams<{ stockId: string }>();
    const [stock, setStock] = useState<StockRes>();
    const [boxes, setBoxes] = useState<BoxMapRes[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const dispatch = useDispatch();
    const {getText} = useTenantNaming();

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

    const handleBoxDetails = (box: BoxMapRes) => {
        dispatch(showModal(<BoxDetail box={box} stockId={stock!.id} callback={getBoxes} />))
    }

    useEffect(() => {
        getStock();
        getBoxes();
    }, [])

    if (loading || !stock) return <Spinner />

    return <Section>
        <Header variant='h2'>{getText('handling')}</Header>
        <MapView stock={stock} boxes={boxes} admin onBoxClick={handleBoxDetails} />
    </Section>
}

export { Handling }