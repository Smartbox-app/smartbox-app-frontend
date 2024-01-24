import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { boxesList } from 'smartbox-tables';
import { BoxListRes } from 'smartbox-types';
import { ApiTable } from '../../../../../../../components/Common';
import { Button } from '../../../../../../../components/Branded';
import { ButtonsContainer, PageHeader, Section, SimpleHeader } from '../../../../../../../components/Layout';
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

    const deleteBox = async (boxId: string) => {
        await ApiService.callFetch('DELETE', `box/${boxId}`, () => {
            dispatch(successNotification('application.boxDeleted'));
            dispatch(refreshApiTableData());
        })
    }

    const confirmBoxDelete = (boxId: string) => {
        dispatch(showModal(<ConfirmModal
            approveButtonText='application.delete'
            mainText='application.deleteBoxText'
            approveAction={() => deleteBox(boxId)}
        />))
    }

    const scheme = new InteractiveTableSchema(boxesList)
        .addFieldAtTheEnd({
            name: __('application.actions'),
            field: 'actions',
            mobile: true,
            buttons: [
                {
                    name: 'application.edit',
                    type: 'primary',
                    click: (data: BoxListRes) => dispatch(showModal(<Edit id={data.id} stockId={data.stockId} />)),
                },
                {
                    name: 'application.delete',
                    type: 'danger',
                    click: (data: BoxListRes) => confirmBoxDelete(data.id),
                }
            ],
        });

    return (
        <>
            <SimpleHeader title='application.boxesList' />
            <ButtonsContainer>
                <Button text='application.addBox' primary to={`/${UserService.getSlugByRole(user.role)}/locations/stocks/${stockId}/boxes/add`} />
            </ButtonsContainer>
            <ApiTable scheme={scheme} apiEndpointSubUrl={`box/list/${stockId}`} />
        </>
    );
}

export { List }