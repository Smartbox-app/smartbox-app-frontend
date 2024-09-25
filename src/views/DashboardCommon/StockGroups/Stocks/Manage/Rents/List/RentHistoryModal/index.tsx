import React from 'react';
import { RentDescription } from 'smartbox-types';


import { RentHistory } from '../../../../../../RentHistory';

interface Props {
    description: RentDescription[];
    rentId: string;
}

export const RentHistoryModal = ({ description, rentId }: Props) => {
    return (
        <RentHistory description={description} rentId={rentId} />
    );
};

