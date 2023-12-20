import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { boxGroupsList } from 'smartbox-tables';
import { BoxGroupListRes } from 'smartbox-types';
import { ApiTable } from '../../../../../../../components/Common';
import { Button } from '../../../../../../../components/Branded';
import { ButtonsContainer, SimpleHeader } from '../../../../../../../components/Layout';
import { __ } from '../../../../../../../helpers/i18n';
import { InteractiveTableSchema } from '../../../../../../../utils/table-schema-utils';
import UserService from '../../../../../../../services/user-service';
import { showModal } from '../../../../../../../actions/modal';
import { ConfirmModal } from '../../../../../../../components/Common';
import ApiService from '../../../../../../../services/api-service';
import { successNotification } from '../../../../../../../actions/notifications';
import { refreshApiTableData } from '../../../../../../../actions/api-table';
import { useParams } from 'react-router';
import { Edit } from '../Edit';
import { ApplicationState } from '../../../../../../../reducers';

const List = () => {
    const user = useSelector((state: ApplicationState) => state.user.details!);
    const dispatch = useDispatch();
    const { stockId } = useParams<{ stockId: string }>();

    const deleteGroup = async (boxGroupId: string) => {
        await ApiService.callFetch('DELETE', `box-group-new/${boxGroupId}`, () => {
            dispatch(successNotification('application.boxGroupDeleted'));
            dispatch(refreshApiTableData());
        })
    }

    const confirmBoxGroupDelete = (groupId: string) => {
        dispatch(showModal(<ConfirmModal
            approveButtonText='application.delete'
            mainText='application.deleteGroupText'
            approveAction={() => deleteGroup(groupId)}
        />))
    }

    const scheme = new InteractiveTableSchema(boxGroupsList)
        .addFieldAtTheEnd({
            name: __('application.actions'),
            field: 'actions',
            mobile: true,
            buttons: [
                {
                    name: 'application.pricing',
                    type: 'primary',
                    to: (data: BoxGroupListRes) => `/${UserService.getSlugByRole(user.role)}/stocks/${stockId}/groups/${data.id}/pricing`
                    // click: (data: BoxGroupListRes) => dispatch(showModal(<Edit id={data.id} stockId={data.stockId} />)),
                },
                {
                    name: 'application.edit',
                    type: 'primary',
                    click: (data: BoxGroupListRes) => dispatch(showModal(<Edit id={data.id} stockId={data.stockId} />)),
                },
                {
                    name: 'application.delete',
                    type: 'danger',
                    click: (data: BoxGroupListRes) => confirmBoxGroupDelete(data.id),
                }
            ],
        });

    return (
        <>
            <SimpleHeader title='application.boxGroupsList' />
            <ButtonsContainer>
                <Button text='application.addBoxGroup' primary to={`/${UserService.getSlugByRole(user.role)}/stocks/${stockId}/groups/add`} />
            </ButtonsContainer>
            <ApiTable scheme={scheme} apiEndpointSubUrl={`box-group-new/list/${stockId}`} />
        </>
    );
}

export { List }