import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import {
  MyRentDetails,
  RentAuthorizedUserSummary,
  RentStatus,
} from 'smartbox-types';
import { Button, Spinner } from 'src/components/Branded';
import { ButtonsContainer } from 'src/components/Layout';
import { Header } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { successNotification } from 'src/actions/notifications';
import { showModal } from 'src/actions/modal';
import ConfirmModal from 'src/components/Common/ConfirmModal';
import { useRentAuthorizedUsersQuery } from 'src/queries';
import { useRemoveRentAuthorizedUserMutation } from 'src/mutations';
import { AddRentAuthorizationModal } from './AddRentAuthorizationModal';
import styled from 'styled-components';

function displayName(row: RentAuthorizedUserSummary): string {
  const name = [row.firstName, row.lastName].filter(Boolean).join(' ').trim();
  return name || row.email;
}

type Props = {
  rent: MyRentDetails;
};

const StyledAuthorization = styled.li(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.spacing * 2,
  borderBottom: `1px solid ${theme.colors.border.secondary}`,
  padding: `${theme.spacing * 5}px 0`,
}));

const StyledAuthorizations = styled.ul(({ theme }) => ({
  padding: `${theme.spacing * 2}px 0`,
}));

export const RentAuthorizations = ({ rent }: Props) => {
  const dispatch = useDispatch();

  const canManage =
    rent.status !== RentStatus.finished &&
    rent.status !== RentStatus.failure &&
    rent.status !== RentStatus.free;

  const { data: authorizations = [], isPending: listLoading } =
    useRentAuthorizedUsersQuery(rent.id, { enabled: canManage });

  const { mutate: removeAuthorization, isPending: removeBusy } =
    useRemoveRentAuthorizedUserMutation();

  const notifyRevokeSuccess = () => {
    dispatch(successNotification(__('application.rentAuthorizationsRevoked')));
  };

  const revokeAuthorizedUser = (authorizationId: string) => {
    removeAuthorization(
      { rentId: rent.id, authorizationId },
      { onSuccess: notifyRevokeSuccess },
    );
  };

  const openAddModal = () => {
    dispatch(showModal(<AddRentAuthorizationModal rentId={rent.id} />));
  };

  const openRevokeConfirmModal = (authorizationId: string) => {
    dispatch(
      showModal(
        <ConfirmModal
          approveButtonText="application.rentAuthorizationsRevoke"
          mainText="application.rentAuthorizationsRevokeConfirm"
          approveAction={() => revokeAuthorizedUser(authorizationId)}
        />,
      ),
    );
  };

  if (!canManage) return null;

  return (
    <>
      <Header variant="h2">{__('application.rentAuthorizations')}</Header>

      <ButtonsContainer>
        <Button
          text="application.rentAuthorizationsAdd"
          primary
          click={openAddModal}
        />
      </ButtonsContainer>

      {listLoading ? (
        <Spinner transparent />
      ) : authorizations.length === 0 ? (
        <p>{__('application.rentAuthorizationsNone')}</p>
      ) : (
        <StyledAuthorizations>
          {authorizations.map((row) => (
            <StyledAuthorization key={row.authorizationId}>
              <div>
                <strong>{displayName(row)}</strong>
                <div>{row.email}</div>
              </div>
              <Button
                danger
                small
                text="application.rentAuthorizationsRevoke"
                disabled={removeBusy}
                click={() => openRevokeConfirmModal(row.authorizationId)}
              />
            </StyledAuthorization>
          ))}
        </StyledAuthorizations>
      )}
    </>
  );
};
