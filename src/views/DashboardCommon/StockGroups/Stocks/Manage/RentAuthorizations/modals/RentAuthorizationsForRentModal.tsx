import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { FieldType, rentAuthorizationsList } from 'smartbox-tables';
import { AdminRentListDetails, RentAuthorizationListItem } from 'smartbox-types';
import { ApiTable, ConfirmModal } from 'src/components/Common';
import { Button } from 'src/components/Branded';
import { ButtonsContainer } from 'src/components/Layout';
import { __ } from 'src/helpers/i18n';
import { InteractiveTableSchema } from 'src/utils/table-schema-utils';
import { showModal, hideModal } from 'src/actions/modal';
import { successNotification } from 'src/actions/notifications';
import { refreshApiTableData } from 'src/actions/api-table';
import { useGetMyDetailsQuery } from 'src/queries';
import { useRevokeRentAuthorizationByStaffMutation } from 'src/mutations';
import { Header, Modal } from 'src/components/ui';
import UserService from 'src/services/user-service';
import { history } from 'src/App';
import { RENT_AUTHORIZATIONS_MODAL } from 'src/constants/api-table-instances';
import { StaffAddRentAuthorizationModal } from './StaffAddRentAuthorizationModal';

type Props = {
  stockId: string;
  rent: AdminRentListDetails;
};

export const RentAuthorizationsForRentModal = ({ stockId, rent }: Props) => {
  const dispatch = useDispatch();
  const { data: user } = useGetMyDetailsQuery();
  const { mutate: revokeAuthorization } =
    useRevokeRentAuthorizationByStaffMutation();

  const slug = user ? UserService.getSlugByRole(user.role) : '';
  const stockAuthorizationsPath = `/${slug}/locations/stocks/${stockId}/authorizations`;

  const onRevokeSucceeded = useCallback(() => {
    dispatch(successNotification(__('application.rentAuthorizationsRevoked')));
    dispatch(refreshApiTableData(RENT_AUTHORIZATIONS_MODAL));
  }, [dispatch, RENT_AUTHORIZATIONS_MODAL]);

  const runRevokeAuthorization = useCallback(
    (authorizationId: string) => {
      revokeAuthorization(authorizationId, {
        onSuccess: onRevokeSucceeded,
      });
    },
    [revokeAuthorization, onRevokeSucceeded],
  );

  const openRevokeConfirm = useCallback(
    (authorizationId: string) => {
      const handleApproveRevoke = () =>
        runRevokeAuthorization(authorizationId);
      dispatch(
        showModal(
          <ConfirmModal
            approveButtonText="application.rentAuthorizationsRevoke"
            mainText="application.rentAuthorizationsRevokeConfirm"
            approveAction={handleApproveRevoke}
          />,
        ),
      );
    },
    [dispatch, runRevokeAuthorization],
  );

  const openAddAuthorizationModal = useCallback(() => {
    dispatch(
      showModal(
        <StaffAddRentAuthorizationModal
          stockId={stockId}
          rentId={rent.id}
        />,
      ),
    );
  }, [dispatch, stockId, rent.id]);

  const goToStockAuthorizationsTab = useCallback(() => {
    dispatch(hideModal());
    history.push(stockAuthorizationsPath);
  }, [dispatch, stockAuthorizationsPath]);

  const scheme = useMemo(
    () =>
      new InteractiveTableSchema(rentAuthorizationsList)
        .removeFields('id', 'rentId', 'tenantId', 'startAt', 'finishAt', 'boxNumber')
        .addFieldAtTheEnd({
          name: __('application.actions'),
          field: 'actions',
          mobile: true,
          type: FieldType.Custom,
          customRender: (_v, _f, row: RentAuthorizationListItem) => (
            <ButtonsContainer max>
              <Button
                text="application.rentAuthorizationsRevoke"
                danger
                small
                click={() => openRevokeConfirm(row.id)}
              />
            </ButtonsContainer>
          ),
        }),
    [openRevokeConfirm],
  );

  return (
    <>
      <Modal.Header title={__('application.rentAuthorizations')} />
      <Modal.Content>
        <Header variant="h3">
          {__('application.rentAuthForRentSubtitle', {
            number: rent.number,
          })}
        </Header>

        <ButtonsContainer>
          <Button
            text="application.rentAuthorizationsAdd"
            primary
            small
            click={openAddAuthorizationModal}
          />
          <Button
            text="application.rentAuthOpenStockAuthorizationsTab"
            secondary
            small
            click={goToStockAuthorizationsTab}
          />
        </ButtonsContainer>

        <ApiTable
          scheme={scheme}
          instanceId={RENT_AUTHORIZATIONS_MODAL}
          apiEndpointSubUrl={`rent/authorizations/${stockId}/${rent.id}`}
        />
      </Modal.Content>
    </>
  );
};
