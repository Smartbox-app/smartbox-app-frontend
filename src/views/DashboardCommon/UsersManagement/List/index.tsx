import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  FieldType,
  TableSchema,
  TableSchemaField,
  usersList,
  usersListForAdmin,
} from 'smartbox-tables';
import {
  IUser,
  UserListRes,
  UserRole,
  UserStatus,
  UserType,
} from 'smartbox-types';
import { ApiTable, ConfirmModal } from '../../../../components/Common';
import { Button } from '../../../../components/Branded';
import { ButtonsContainer, Section } from '../../../../components/Layout';
import { __ } from '../../../../helpers/i18n';
import { InteractiveTableSchema } from '../../../../utils/table-schema-utils';
import { modal, user } from '../../../../actions';
import UserDetail from './UserDetail';
import UserEdit from './UserEdit';
import UserService from '../../../../services/user-service';
import { useGetMyDetailsQuery } from 'src/queries';
import { HeaderWithActions } from 'src/components/ui';
import { UserNoteEditModal } from './UserDetail/UserNoteEditModal';

interface Props {
  showModal: (content: React.ReactNode) => void;
  enableUser: (userId: string) => void;
  blockUser: (userId: string) => void;
  deleteUser: (userId: string) => void;
  deleteUserByForce: (userId: string) => void;
  resendActivationEmail: (userId: string) => void;
}

const List = ({
  showModal,
  enableUser,
  blockUser,
  deleteUser,
  deleteUserByForce,
  resendActivationEmail,
}: Props) => {
  const { data: user } = useGetMyDetailsQuery();

  const hasFullAccess = [UserRole.admin, UserRole.client].includes(user!.role);

  const confirmUserDelete = (userId: string) => {
    showModal(
      <ConfirmModal
        approveButtonText="application.delete"
        mainText="application.deleteUserText"
        approveAction={() => deleteUser(userId)}
      />,
    );
  };

  const confirmUserDeleteByForce = (userId: string) => {
    showModal(
      <ConfirmModal
        approveButtonText="application.delete"
        mainText="application.deleteUserText"
        approveAction={() => deleteUserByForce(userId)}
      />,
    );
  };

  const getLockButton = (
    value: boolean,
    field: TableSchemaField,
    userData: IUser,
  ) => {
    if ([UserStatus.blocked, UserStatus.preActive].includes(userData.status)) {
      return (
        <Button
          text="application.active"
          success
          click={() => enableUser(userData.id)}
        />
      );
    } else {
      return (
        <Button
          text="application.block"
          danger
          click={() => blockUser(userData.id)}
        />
      );
    }
  };

  const scheme: TableSchema = new InteractiveTableSchema(
    user!.role === UserRole.admin ? usersListForAdmin : usersList,
  )
    .modifyFieldStatic('status', {
      name: __('application.state'),
      field: 'status',
      mobile: true,
      defaultSort: true,
      type: FieldType.Custom,
      customRender: (value, field, userData) =>
        getLockButton(value, field, userData),
    })
    .removeFields('role')
    .addFieldAtTheEnd({
      name: __('application.actions'),
      field: 'actions',
      mobile: true,
      type: FieldType.Custom,
      customRender: (value, field, userData: UserListRes) => {
        return (
          <ButtonsContainer noWrap>
            <Button
              primary
              text="application.userDetails"
              click={() =>
                showModal(
                  <UserDetail userId={userData.id} userData={userData} />,
                )
              }
            />
            {hasFullAccess && (
              <>
                <Button
                  secondary
                  text="application.userNote"
                  click={() =>
                    showModal(<UserNoteEditModal userId={userData.id} />)
                  }
                />
                <Button
                  secondary
                  text="application.edit"
                  click={() => showModal(<UserEdit userId={userData.id} />)}
                />
                {userData.canResendActivationEmail && (
                  <Button
                    secondary
                    text="application.resendActivationEmail"
                    click={() => resendActivationEmail(userData.id)}
                  />
                )}
                <Button
                  danger
                  text="application.delete"
                  click={() => confirmUserDelete(userData.id)}
                />
              </>
            )}
            {user!.role === UserRole.admin ? (
              <Button
                danger
                text="application.deleteByForce"
                click={() => confirmUserDeleteByForce(userData.id)}
              />
            ) : null}
          </ButtonsContainer>
        );
      },
    });

  return (
    <Section>
      <HeaderWithActions
        actions={
          <ButtonsContainer>
            {hasFullAccess && (
              <Button
                text="application.addUser"
                primary
                to={`/${UserService.getSlugByRole(user!.role)}/management/users/add`}
              />
            )}
            <Button
              text="application.inviteUser"
              primary
              to={`/${UserService.getSlugByRole(user!.role)}/management/users/invite`}
            />
            {/* <Button text='application.historyWorker' secondary to={`/${UserService.getSlugByRole(user.role)}/management/workers/history`} /> */}
          </ButtonsContainer>
        }
      >
        {__('application.usersList')}
      </HeaderWithActions>

      <ApiTable
        scheme={scheme}
        apiEndpointSubUrl={`user/list/${UserType.user}`}
      />
    </Section>
  );
};

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators({ ...modal, ...user }, dispatch);

export default connect(null, mapDispatchToProps)(List);
