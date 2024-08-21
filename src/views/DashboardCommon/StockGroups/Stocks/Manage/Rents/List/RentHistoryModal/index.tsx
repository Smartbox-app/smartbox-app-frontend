import React from 'react';
import { RentDescription } from 'smartbox-types';


import { RentHistory } from '../../../../../../RentHistory';

interface Props {
    description: RentDescription[];
}

export const RentHistoryModal = ({ description }: Props) => {
    return (
        <RentHistory description={description} />
    );
};

