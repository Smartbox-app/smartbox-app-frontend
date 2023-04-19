import React from 'react';
import { useDispatch } from 'react-redux';
import { GateAdminList } from 'smartbox-types';
import { gateList } from 'smartbox-tables';
import { showModal } from '../../../../actions/modal';
import { successNotification } from '../../../../actions/notifications';
import ApiService from '../../../../services/api-service';
import { Button, ApiTable, ConfirmModal } from '../../../../components/Common';
import { Section, PageHeader, ButtonsContainer } from '../../../../components/Layout';
import { __ } from '../../../../helpers/i18n';
import { InteractiveTableSchema } from '../../../../utils/table-schema-utils';
import { refreshApiTableData } from '../../../../actions/api-table';
import { history } from '../../../../App';

const List = () => {
    const dispatch = useDispatch();
    const scheme = new InteractiveTableSchema(gateList)

    scheme.addFieldAtTheEnd({
        name: __('application.actions'),
        field: 'actions',
        mobile: true,
        buttons: [
            {
                name: 'application.delete',
                type: 'danger',
                click: (data: GateAdminList) => confirmGateDelete(data),
            },
            {
                name: 'application.edit',
                type: 'primary',
                click: (data: GateAdminList) => history.push(`/admin/gates/${data.id}`),
            },
        ],
    });

    const confirmGateDelete = (data: GateAdminList) => {
        dispatch(showModal(<ConfirmModal mainText='application.confirmGateDelete' approveButtonText='application.yes' approveAction={() => deleteGate(data)} />))
    }

    const deleteGate = async (data: GateAdminList) => {
        await ApiService.callFetch('DELETE', `gate/${data.id}`, () => {
            dispatch(successNotification('application.gateDeleted'));
            dispatch(refreshApiTableData());
        });
    }


    return (
        <Section full>
            <PageHeader title='application.gatesList' />
            <ButtonsContainer>
                <Button text='application.addGate' primary to="/admin/gates/add" />
            </ButtonsContainer>
            <ApiTable scheme={scheme} apiEndpointSubUrl={`gate/admin-list`} />
        </Section>
    );

}

export { List }