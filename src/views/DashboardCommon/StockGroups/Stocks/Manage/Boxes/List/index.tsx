import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FieldType, boxesList } from 'smartbox-tables';
import { AccessControl, BoxListRes, IStock } from 'smartbox-types';
import { Alert, ApiTable } from '../../../../../../../components/Common';
import { Button, Spinner } from '../../../../../../../components/Branded';
import { ButtonsContainer, SimpleHeader } from '../../../../../../../components/Layout';
import { __ } from '../../../../../../../helpers/i18n';
import { InteractiveTableSchema } from '../../../../../../../utils/table-schema-utils';
import UserService from '../../../../../../../services/user-service';
import { showModal } from '../../../../../../../actions/modal';
import { ConfirmModal } from '../../../../../../../components/Common';
import ApiService from '../../../../../../../services/api-service';
import { errorNotification, errorNotificationText, successNotification } from '../../../../../../../actions/notifications';
import { refreshApiTableData } from '../../../../../../../actions/api-table';
import { useParams } from 'react-router';
import { Edit } from '../Edit';
import { ApplicationState } from '../../../../../../../reducers';
import BoxDetail from '../../../../../../../views/DashboardCommon/BoxMapManagement/BoxDetail';
import { BoxStatus } from './BoxStatus';

const List = () => {
    const user = useSelector((state: ApplicationState) => state.user.details!);
    const dispatch = useDispatch();
    const [stock, setStock] = useState<IStock>();
    const [isLoading, setIsLoading] = useState(false);
    const { stockId } = useParams<{ stockId: string }>();

    const getStock = async () => {
        await ApiService.callFetch('GET', `stock/${stockId}`, (res: IStock) => {
            setStock(res);
        })
    }

    const deleteBox = async (boxId: string) => {
        setIsLoading(true);
        await ApiService.callFetch('DELETE', `box/${boxId}`, () => {
            dispatch(successNotification('application.boxDeleted'));
            dispatch(refreshApiTableData());
        })
    }

    const openBox = async (boxId: string) => {
        setIsLoading(true);
        await ApiService.callFetch('GET', `box/open/${boxId}`, (isSuccess: boolean) => {
            if (isSuccess) {
                dispatch(successNotification('application.boxOpenedSuccessfully'));
            } else {
                dispatch(errorNotificationText('application.cannotOpenBox'));
            }
        })
        setIsLoading(false);
    }

    const confirmBoxDelete = (boxId: string) => {
        dispatch(showModal(<ConfirmModal
            approveButtonText='application.delete'
            mainText='application.deleteBoxText'
            approveAction={() => deleteBox(boxId)}
        />))
    }

    const confirmBoxOpen = (boxId: string) => {
        dispatch(showModal(<ConfirmModal
            approveButtonText='application.openBox'
            mainText='application.openBoxConfirmation'
            approveAction={() => openBox(boxId)}
        />))
    }

    useEffect(() => { getStock() }, [stockId])

    const scheme = new InteractiveTableSchema(boxesList)
        .modifyFieldStatic('pricing', {
            name: __('application.pricingIsSet'),
            field: 'pricing',
            mobile: true,
            defaultSort: true,
            type: FieldType.Custom,
            customRender: (value, field, boxData) => (boxData.pricing && boxData.pricing.length > 0) ? <Alert simple type='success' text='application.yes' /> : <Alert simple type='error' text='application.no' />
        })
        .modifyFieldStatic('status', {
            name: __('application.state'),
            field: 'status',
            mobile: true,
            defaultSort: true,
            type: FieldType.Custom,
            customRender: (value, field, boxData) => <BoxStatus box={boxData} stock={stock} />,
        })
        .addFieldAtTheEnd({
            name: __('application.actions'),
            field: 'actions',
            type: FieldType.Custom,
            mobile: true,
            customRender: (value, field, boxData: BoxListRes) => (
                <>
                    {(stock?.accessControl === AccessControl.ksm && boxData.controlled) ? <Button text='application.openBox' click={() => confirmBoxOpen(boxData.id)} /> : undefined}
                    <Button primary text='application.manage' click={() => dispatch(showModal(<BoxDetail box={boxData} stockId={stockId} />))} />
                    <Button secondary text='application.edit' click={() => dispatch(showModal(<Edit id={boxData.id} stockId={boxData.stockId} />))} />
                    <Button danger text='application.delete' click={() => confirmBoxDelete(boxData.id)} />
                </>
            )
        });

    return (
        <>
            {isLoading && <Spinner overlay halfTransparent />}
            <SimpleHeader title='application.boxesList' />
            <ButtonsContainer>
                <Button text='application.addBox' primary to={`/${UserService.getSlugByRole(user.role)}/locations/stocks/${stockId}/boxes/add`} />
                <Button text='application.addBoxes' secondary to={`/${UserService.getSlugByRole(user.role)}/locations/stocks/${stockId}/boxes/add-multiple`} />
            </ButtonsContainer>
            <ApiTable scheme={scheme} apiEndpointSubUrl={`box/list/${stockId}`} />
        </>
    );
}

export { List }