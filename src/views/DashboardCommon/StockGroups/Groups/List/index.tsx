import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { stockGroupsList } from 'smartbox-tables';
import { StockGroupData } from 'smartbox-types';
import { showModal } from '../../../../../actions/modal';
import { successNotification } from '../../../../../actions/notifications';
import ApiService from '../../../../../services/api-service';
import { ApiTable, ConfirmModal } from '../../../../../components/Common';
import { __ } from '../../../../../helpers/i18n';
import { InteractiveTableSchema } from '../../../../../utils/table-schema-utils';
import { refreshApiTableData } from '../../../../../actions/api-table';
import UserService from '../../../../../services/user-service';
import { ApplicationState } from '../../../../../reducers';
import { history } from '../../../../../App';
import { ButtonsContainer, PageHeader, Section } from '../../../../../components/Layout';
import { Button } from '../../../../../components/Branded';

const GroupsList = () => {
    const dispatch = useDispatch();
    const scheme = new InteractiveTableSchema(stockGroupsList)
    const user = useSelector((state: ApplicationState) => state.user.details!);

    scheme.addFieldAtTheEnd({
        name: __('application.actions'),
        field: 'actions',
        mobile: true,
        buttons: [

            {
                name: 'application.delete',
                type: 'danger',
                click: (data: StockGroupData) => confirmStockGroupDelete(data),
            },
            {
                name: 'application.manage',
                type: 'primary',
                click: (data: StockGroupData) => history.push(`/${UserService.getSlugByRole(user.role)}/locations/groups/${data.id}`),
            },
        ],
    });

    const confirmStockGroupDelete = (data: StockGroupData) => {
        dispatch(showModal(<ConfirmModal mainText='application.confirmStockGroupDelete' approveButtonText='application.yes' approveAction={() => deleteStockGroup(data)} />))
    }

    const deleteStockGroup = async (data: StockGroupData) => {
        await ApiService.callFetch('DELETE', `stock-group/${data.id}`, () => {
            dispatch(successNotification('application.stockGroupDeleted'));
            dispatch(refreshApiTableData());
        });
    }


    return (
        <Section full>
            <PageHeader title='application.stockGroupsList' />
            <ButtonsContainer>
                <Button text='application.addStockGroup' primary to={`/${UserService.getSlugByRole(user.role)}/locations/groups/add`} />
            </ButtonsContainer>
            <ApiTable scheme={scheme} apiEndpointSubUrl={`stock-group/admin-list`} />
        </Section>
    );

}

export { GroupsList }