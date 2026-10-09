import React from 'react';
import { useDispatch } from 'react-redux';
import { apiAccessTableSchema } from 'smartbox-tables';
import { ApiAccessTableRes, CreateApiAccessRes } from 'smartbox-types';
import { showModal } from 'src/actions/modal';
import { successNotification } from 'src/actions/notifications';
import { refreshApiTableData } from 'src/actions/api-table';
import { ApiTable, ConfirmModal } from 'src/components/Common';
import { Button } from 'src/components/Branded';
import { ButtonsContainer } from 'src/components/Layout';
import { HeaderWithActions, Section } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import {
  useDeleteApiAccessMutation,
  useRotateApiAccessKeyMutation,
} from 'src/mutations';
import { InteractiveTableSchema } from 'src/utils/table-schema-utils';
import { useApiAccessScopes } from 'src/hooks/useApiAccessScopes';
import { TenantApiAccess } from 'src/views/DashboardTenant/ApiAccess';
import { CreateApiAccessModal } from '../CreateApiAccessModal';
import { EditApiAccessModal } from '../EditApiAccessModal';
import { ApiKeyCreatedModal } from '../ApiKeyCreatedModal';

const List = () => {
  const dispatch = useDispatch();
  const { mutate: rotateApiAccessKey } = useRotateApiAccessKeyMutation();
  const { mutate: deleteApiAccess } = useDeleteApiAccessMutation();
  const { scopeOptions, normalizeScopes } = useApiAccessScopes();

  const scheme = new InteractiveTableSchema(apiAccessTableSchema)
    .modifyFieldStatic('scopes', {
      customValue: (row: ApiAccessTableRes) =>
        normalizeScopes(row.scopes)
          .map(
            (value) =>
              scopeOptions.find((option) => option.value === value)?.label ??
              value,
          )
          .join(', '),
    })
    .addFieldAtTheEnd(
    {
      name: __('application.actions'),
      field: 'actions',
      mobile: true,
      buttons: [
        {
          name: 'application.edit',
          type: 'primary',
          click: (data: ApiAccessTableRes) =>
            dispatch(showModal(<EditApiAccessModal row={data} />)),
        },
        {
          name: 'application.apiAccessRotateKey',
          type: 'primary',
          click: (data: ApiAccessTableRes) => handleConfirmRotate(data),
        },
        {
          name: 'application.delete',
          type: 'danger',
          click: (data: ApiAccessTableRes) => handleConfirmDelete(data),
        },
      ],
    },
  );

  const handleConfirmDelete = (data: ApiAccessTableRes) => {
    dispatch(
      showModal(
        <ConfirmModal
          mainText="application.apiAccessDeleteConfirm"
          approveButtonText="application.delete"
          approveAction={() => handleDelete(data)}
        />,
      ),
    );
  };

  const handleDeleteSuccess = () => {
    dispatch(successNotification(__('application.apiAccessDeleted')));
    dispatch(refreshApiTableData());
  };

  const handleDelete = (data: ApiAccessTableRes) => {
    deleteApiAccess(data.id, { onSuccess: handleDeleteSuccess });
  };

  const handleRotateSuccess = (
    rotatedAccess: CreateApiAccessRes | undefined,
  ) => {
    if (!rotatedAccess) return;
    dispatch(refreshApiTableData());
    setTimeout(() => {
      dispatch(
        showModal(
          <ApiKeyCreatedModal
            apiKey={rotatedAccess.apiKey}
            name={rotatedAccess.name}
            rotated
          />,
        ),
      );
    }, 350);
  };

  const handleRotateKey = (data: ApiAccessTableRes) => {
    rotateApiAccessKey(data.id, { onSuccess: handleRotateSuccess });
  };

  const handleConfirmRotate = (data: ApiAccessTableRes) => {
    dispatch(
      showModal(
        <ConfirmModal
          mainText="application.apiAccessRotateConfirm"
          approveButtonText="application.yes"
          approveAction={() => handleRotateKey(data)}
        />,
      ),
    );
  };

  return (
    <>
      <Section>
        <HeaderWithActions
          actions={
            <ButtonsContainer>
              <Button
                text="application.newApiAccess"
                primary
                click={() => dispatch(showModal(<CreateApiAccessModal />))}
              />
            </ButtonsContainer>
          }
        >
          {__('application.apiAccessList')}
        </HeaderWithActions>
        <ApiTable scheme={scheme} apiEndpointSubUrl="api-access" />
      </Section>
      <TenantApiAccess forAdmin />
    </>
  );
};

export { List };
