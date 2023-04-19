import React from 'react';
import { useParams } from 'react-router';
import Gate from '../../SingleRentDetail/Gate';



const SingleGate = () => {
    const { stockId } = useParams<{ stockId: string }>();
    return <>
        <Gate stockId={stockId} />
    </>
}

export { SingleGate }