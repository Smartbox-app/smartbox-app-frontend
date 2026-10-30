import React from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';

import { FieldType, addonList } from 'smartbox-tables';
import { AddonListRes, ApiErrorCode } from 'smartbox-types';
import { refreshApiTableData } from 'src/actions/api-table';
import { showModal } from 'src/actions/modal';
import {
  errorNotification,
  successNotification,
} from 'src/actions/notifications';
import { Button } from 'src/components/Branded';
import { Alert, ApiTable, ConfirmModal } from 'src/components/Common';
import { ButtonsContainer } from 'src/components/Layout';
import { HeaderWithActions, Section } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { useDeleteAddonMutation } from 'src/mutations';
import { useGetMyDetailsQuery } from 'src/queries';
import UserService from 'src/services/user-service';
import { InteractiveTableSchema } from 'src/utils/table-schema-utils';

import { CannotDeleteAddonModal } from '../CannotDeleteAddonModal';
import { Edit } from '../Edit';

const List = () => {
  const { data: user } = useGetMyDetailsQuery();
  const dispatch = useDispatch();
  const { stockId } = useParams<{ stockId: string }>();
  const { mutate: deleteAddon } = useDeleteAddonMutation();

  const handleDeleteSuccess = () => {
    dispatch(successNotification('application.addonDeleted'));
    dispatch(refreshApiTableData());
  };

  const handleDeleteError = (error: Error) => {
    const errorCode = Number(error.message) as ApiErrorCode;
    if (errorCode === ApiErrorCode.CanNotDeleteAddonUsedByOpenEndedRent) {
      dispatch(showModal(<CannotDeleteAddonModal />));
      return;
    }
    dispatch(errorNotification(errorCode));
  };

  const handleDelete = (addonId: string) => {
    deleteAddon(addonId, {
      onSuccess: handleDeleteSuccess,
      onError: handleDeleteError,
    });
  };

  const confirmAddonDelete = (addon: AddonListRes) => {
    dispatch(
      showModal(
        <ConfirmModal
          approveButtonText="application.delete"
          mainText="application.deleteAddonText"
          approveAction={() => handleDelete(addon.id)}
        />,
      ),
    );
  };

  const scheme = new InteractiveTableSchema(addonList)
    .modifyFieldStatic('pricing', {
      name: __('application.pricingIsSet'),
      field: 'pricing',
      mobile: true,
      defaultSort: true,
      type: FieldType.Custom,
      customRender: (value, field, addonData: AddonListRes) => {
        if (addonData.noPricing === true) {
          return (
            <Alert
              compact
              type="success"
              text="application.addonWithoutPrice"
            />
          );
        }

        if (addonData.pricing && addonData.pricing.length > 0) {
          return <Alert compact type="success" text="application.yes" />;
        } 
          return <Alert compact type="error" text="application.no" />;
        
      },
    })
    .addFieldAtTheEnd({
      name: __('application.actions'),
      field: 'actions',
      mobile: true,
      buttons: [
        {
          name: 'application.pricing',
          type: 'primary',
          to: (data) =>
            `/${UserService.getSlugByRole(user!.role)}/locations/stocks/${stockId}/addons/${(data as AddonListRes).id}/pricing`,
        },
        {
          name: 'application.edit',
          type: 'secondary',
          click: (data: AddonListRes) =>
            dispatch(showModal(<Edit id={data.id} stockId={data.stockId} />)),
        },
        {
          name: 'application.delete',
          type: 'danger',
          click: (data: AddonListRes) => confirmAddonDelete(data),
        },
      ],
    });

  return (
    <Section>
      <HeaderWithActions
        actions={
          <ButtonsContainer>
            <Button
              text="application.addAddon"
              primary
              to={`/${UserService.getSlugByRole(user!.role)}/locations/stocks/${stockId}/addons/add`}
            />
          </ButtonsContainer>
        }
      >
        {__('application.addonsList')}
      </HeaderWithActions>

      <ApiTable scheme={scheme} apiEndpointSubUrl={`addon/list/${stockId}`} />
    </Section>
  );
};

export { List };
