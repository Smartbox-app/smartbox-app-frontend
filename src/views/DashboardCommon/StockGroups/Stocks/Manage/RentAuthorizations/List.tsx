import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { FieldType, rentAuthorizationsList } from 'smartbox-tables';
import { RentAuthorizationListItem } from 'smartbox-types';
import { ApiTable, ConfirmModal } from 'src/components/Common';
import { Button } from 'src/components/Branded';
import { __ } from 'src/helpers/i18n';
import { InteractiveTableSchema } from 'src/utils/table-schema-utils';
import { showModal } from 'src/actions/modal';
import { successNotification } from 'src/actions/notifications';
import { refreshApiTableData } from 'src/actions/api-table';
import { useGetMyDetailsQuery } from 'src/queries';
import { useRevokeRentAuthorizationByStaffMutation } from 'src/mutations';
import { Header, Section } from 'src/components/ui';

export const RentAuthorizationsList = () => {
  const dispatch = useDispatch();
  const { stockId } = useParams<{ stockId: string }>();
  const { data: user } = useGetMyDetailsQuery();
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
