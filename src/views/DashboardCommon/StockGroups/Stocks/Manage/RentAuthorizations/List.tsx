import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';

import { FieldType, rentAuthorizationsList } from 'smartbox-tables';
import { RentAuthorizationListItem } from 'smartbox-types';
import { refreshApiTableData } from 'src/actions/api-table';
import { showModal } from 'src/actions/modal';
import { successNotification } from 'src/actions/notifications';
import { Button } from 'src/components/Branded';
import { ApiTable, ConfirmModal } from 'src/components/Common';
import { Header, Section } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { useRevokeRentAuthorizationByStaffMutation } from 'src/mutations';
import { InteractiveTableSchema } from 'src/utils/table-schema-utils';

export const RentAuthorizationsList = () => {
  const dispatch = useDispatch();
  const { stockId } = useParams<{ stockId: string }>();

  const {
    mutate: revokeAuthorization,
    isPending,
    isSuccess,
  } = useRevokeRentAuthorizationByStaffMutation();

  useEffect(() => {
    if (!isSuccess) return;

    dispatch(successNotification(__('application.rentAuthorizationsRevoked')));
    dispatch(refreshApiTableData());
  }, [isSuccess, dispatch]);

  const handleRevokeAuthorization = (authorizationId: string) => {
    revokeAuthorization(authorizationId);
  };

  const scheme = new InteractiveTableSchema(rentAuthorizationsList)
    .removeFields('id', 'rentId', 'tenantId')
    .addFieldAtTheEnd({
      name: __('application.actions'),
      field: 'actions',
      mobile: true,
      type: FieldType.Custom,
      customRender: (_v, _f, row: RentAuthorizationListItem) => (
        <Button
          text="application.rentAuthorizationsRevoke"
          danger
          small
          disabled={isPending}
          click={() =>
            dispatch(
              showModal(
                <ConfirmModal
                  approveButtonText="application.rentAuthorizationsRevoke"
                  mainText="application.rentAuthorizationsRevokeConfirm"
                  approveAction={() => handleRevokeAuthorization(row.id)}
                />,
              ),
            )
          }
        />
      ),
    });

  return (
    <Section>
      <Header variant="h2">{__('application.rentAuthManagementTitle')}</Header>
      <ApiTable
        scheme={scheme}
        apiEndpointSubUrl={`rent/authorizations/${stockId}`}
      />
    </Section>
  );
};
