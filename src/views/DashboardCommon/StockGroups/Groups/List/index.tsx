import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { stockGroupsList, stocksList } from 'smartbox-tables';
import { StockGroupEntity } from 'smartbox-types';
import { showModal } from '../../../../../actions/modal';
import { successNotification } from '../../../../../actions/notifications';
import ApiService from '../../../../../services/api-service';
import { ApiTable, ConfirmModal } from '../../../../../components/Common';
import { Button } from '../../../../../components/Branded';
import { Section, PageHeader, ButtonsContainer } from '../../../../../components/Layout';
import { __ } from '../../../../../helpers/i18n';
import { InteractiveTableSchema } from '../../../../../utils/table-schema-utils';
import { refreshApiTableData } from '../../../../../actions/api-table';
import UserService from '../../../../../services/user-service';
import { ApplicationState } from '../../../../../reducers';
import { Edit } from '../Edit';

const List = () => {
    const dispatch = useDispatch();
    const scheme = new InteractiveTableSchema(stockGroupsList)
    const user = useSelector((state: ApplicationState) => state.user.details!);

    scheme.addFieldAtTheEnd({
        name: __('application.actions'),
        field: 'actions',
        mobile: true,
        buttons: [
            {
                name: 'application.edit',
                type: 'primary',
                click: (data: StockGroupEntity) => dispatch(showModal(<Edit id={data.id} />)),
            },
            {
                name: 'application.delete',
                type: 'danger',
                click: (data: StockGroupEntity) => confirmStockGroupDelete(data),
            },
        ],
    });

    const confirmStockGroupDelete = (data: StockGroupEntity) => {
        dispatch(showModal(<ConfirmModal mainText='application.confirmStockGroupDelete' approveButtonText='application.yes' approveAction={() => deleteStockGroup(data)} />))
    }

    const deleteStockGroup = async (data: StockGroupEntity) => {
        await ApiService.callFetch('DELETE', `stock-group/${data.id}`, () => {
            dispatch(successNotification('application.stockGroupDeleted'));
            dispatch(refreshApiTableData());
        });
    }


    return (
        <Section full>
            <PageHeader title='application.stockGroupsList' />
            <ButtonsContainer>
                <Button text='application.addStockGroup' primary to={`/${UserService.getSlugByRole(user.role)}/stocks/groups/add`} />
            </ButtonsContainer>
            <ApiTable scheme={scheme} apiEndpointSubUrl={`stock-group/admin-list`} />
        </Section>
    );

}

export { List }