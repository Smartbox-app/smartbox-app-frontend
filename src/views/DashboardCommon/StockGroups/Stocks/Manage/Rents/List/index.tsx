import React from 'react';
import { useDispatch } from 'react-redux';
import { FieldType, rentsList } from 'smartbox-tables';
import { AdminRentListDetails } from 'smartbox-types';
import { ApiTable } from '../../../../../../../components/Common';
import { Button } from '../../../../../../../components/Branded';
import { SimpleHeader } from '../../../../../../../components/Layout';
import { __ } from '../../../../../../../helpers/i18n';
import { InteractiveTableSchema } from '../../../../../../../utils/table-schema-utils';
import { showModal } from '../../../../../../../actions/modal';
import { useParams } from 'react-router';
import { RentHistoryModal } from './RentHistoryModal';


const List = () => {
    const dispatch = useDispatch();
    const { stockId } = useParams<{ stockId: string }>();


    const scheme = new InteractiveTableSchema(rentsList)
        .removeFields('description', 'id', 'userId')
        .addFieldAtTheEnd({
            name: __('application.actions'),
            field: 'actions',
            type: FieldType.Custom,
            mobile: true,
            customRender: (value, field, rentData: AdminRentListDetails) => (
                <>
                    { rentData.description && Array.isArray(rentData.description) && rentData.description.length > 0 ? <Button primary text='application.rentHistory' click={() => dispatch(showModal(<RentHistoryModal rentId={rentData.id} description={rentData.description} />))} /> : undefined }
                </>
            )
        });

    return (
        <>
            <SimpleHeader title='application.stockRents' />
            <p>Podsumowanie wynajmów jest wysyłane codziennie na adres e-mail konta franczyzobiorcy.</p>
            <ApiTable scheme={scheme} apiEndpointSubUrl={`rent/list/${stockId}`} />
        </>
    );
}

export { List }