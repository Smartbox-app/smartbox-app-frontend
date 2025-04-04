import React from 'react';
import { useDispatch } from 'react-redux';
import { FieldType, addonList } from 'smartbox-tables';
import { AddonListRes } from 'smartbox-types';
import { Alert, ApiTable } from '../../../../../../../components/Common';
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
import { useGetMyDetailsQuery } from 'src/queries';

const List = () => {
      const { data: user } = useGetMyDetailsQuery();
    const dispatch = useDispatch();
    const { stockId } = useParams<{ stockId: string }>();

    const deleteAddon = async (addonId: string) => {
        await ApiService.callFetch('DELETE', `addon/${addonId}`, () => {
            dispatch(successNotification('application.addonDeleted'));
            dispatch(refreshApiTableData());
        })
    }

    const confirmAddonDelete = (addonId: string) => {
        dispatch(showModal(<ConfirmModal
            approveButtonText='application.delete'
            mainText='application.deleteAddonText'
            approveAction={() => deleteAddon(addonId)}
        />))
    }

    const scheme = new InteractiveTableSchema(addonList)
        .modifyFieldStatic('pricing', {
            name: __('application.pricingIsSet'),
            field: 'pricing',
            mobile: true,
            defaultSort: true,
            type: FieldType.Custom,
            customRender: (value, field, boxData) => (boxData.pricing && boxData.pricing.length > 0) ? <Alert simple type='success' text='application.yes' /> : <Alert simple type='error' text='application.no' />
        })
        .addFieldAtTheEnd({
            name: __('application.actions'),
            field: 'actions',
            mobile: true,
            buttons: [
                {
                    name: 'application.pricing',
                    type: 'primary',
                    to: (data: AddonListRes) => `/${UserService.getSlugByRole(user!.role)}/locations/stocks/${stockId}/addons/${data.id}/pricing`
                    // click: (data: AddonListRes) => dispatch(showModal(<Edit id={data.id} stockId={data.stockId} />)),
                },
                {
                    name: 'application.edit',
                    type: 'secondary',
                    click: (data: AddonListRes) => dispatch(showModal(<Edit id={data.id} stockId={data.stockId} />)),
                },
                {
                    name: 'application.delete',
                    type: 'danger',
                    click: (data: AddonListRes) => confirmAddonDelete(data.id),
                }
            ],
        });

    return (
        <>
            <SimpleHeader title='application.addonsList' />
            <ButtonsContainer>
                <Button text='application.addAddon' primary to={`/${UserService.getSlugByRole(user!.role)}/locations/stocks/${stockId}/addons/add`} />
            </ButtonsContainer>
            <ApiTable scheme={scheme} apiEndpointSubUrl={`addon/list/${stockId}`} />
        </>
    );
}

export { List }