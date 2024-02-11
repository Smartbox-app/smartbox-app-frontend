import React from 'react';
import { useParams } from 'react-router';
import { Section, SimpleHeader } from '../../../../../../components/Layout';
import Gate from '../../../../../../views/DashboardCommon/SingleRentDetail/Gate';

const StockGate = () => {
    const { stockId } = useParams<{ stockId: string }>();
    return <Section full>
        <SimpleHeader title='application.gate' />
        <Gate stockId={stockId} />
    </Section>
}

export { StockGate }