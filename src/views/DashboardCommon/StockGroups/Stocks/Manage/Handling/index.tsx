import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import ApiService from '../../../../../../services/api-service';
import { BoxMapRes, IStock } from 'smartbox-types';
import { Section, SimpleHeader } from '../../../../../../components/Layout';
import { Spinner } from '../../../../../../components/Branded';
import { MapView } from '../../../../MapView';
import { useDispatch } from 'react-redux';
import BoxDetail from '../../../../BoxDetail';
import { showModal } from '../../../../../../actions/modal';

const Handling = () => {
    const { stockId } = useParams<{ stockId: string }>();
    const [stock, setStock] = useState<IStock>();
    const [boxes, setBoxes] = useState<BoxMapRes[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const dispatch = useDispatch();

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

    const handleBoxDetails = (box: BoxMapRes) => {
        dispatch(showModal(<BoxDetail box={box} stockId={stock!.id} callback={getBoxes} />))
    }

    useEffect(() => {
        getStock();
        getBoxes();
    }, [])

    if (loading || !stock) return <Spinner />

    return <Section full>
        <SimpleHeader title='application.stockHandling' />
        <MapView stock={stock} boxes={boxes} admin onBoxClick={handleBoxDetails} />
    </Section>
}

export { Handling }