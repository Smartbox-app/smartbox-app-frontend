import React from 'react';
import { useDispatch } from 'react-redux';
import { stocksList } from 'smartbox-tables';
import { showModal } from '../../../../actions/modal';
import { successNotification } from '../../../../actions/notifications';
import ApiService from '../../../../services/api-service';
import { StockAdminList } from '../../../../../../smartbox-back/types/stock';
import { Button, ApiTable, ConfirmModal } from '../../../../components/Common';
import { Section, PageHeader, ButtonsContainer } from '../../../../components/Layout';
import { __ } from '../../../../helpers/i18n';
import { InteractiveTableSchema } from '../../../../utils/table-schema-utils';
import { refreshApiTableData } from '../../../../actions/api-table';
import { history } from '../../../../App';

const List = () => {
    const dispatch = useDispatch();
    const scheme = new InteractiveTableSchema(stocksList)

    scheme.addFieldAtTheEnd({
        name: __('application.actions'),
        field: 'actions',
        mobile: true,
        buttons: [
            {
                name: 'application.delete',
                type: 'danger',
                click: (data: StockAdminList) => confirmStockDelete(data),
            },
            {
                name: 'application.manage',
                type: 'primary',
                click: (data: StockAdminList) => history.push(`/admin/stocks/${data.id}`),
            },
        ],
    });

    const confirmStockDelete = (data: StockAdminList) => {
        dispatch(showModal(<ConfirmModal mainText='application.confirmStockDelete' approveButtonText='application.yes' approveAction={() => deleteStock(data)} />))
    }

    const deleteStock = async (data: StockAdminList) => {
        await ApiService.callFetch('DELETE', `stock/${data.id}`, () => {
            dispatch(successNotification('application.stockDeleted'));
            dispatch(refreshApiTableData());
        });
    }


    return (
        <Section full>
            <PageHeader title='application.stocksList' />
            <ButtonsContainer>
                <Button text='application.addStock' primary to="/admin/stocks/add" />
            </ButtonsContainer>
            <ApiTable scheme={scheme} apiEndpointSubUrl={`stock/admin-list`} />
        </Section>
    );

}

export { List }