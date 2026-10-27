import React from 'react';
import { useDispatch } from 'react-redux';

import { FieldType, TableSchemaField, usersList } from 'smartbox-tables';
import { UserListRes, UserStatus, UserType } from 'smartbox-types';
import { showModal } from 'src/actions/modal';
import { Button } from 'src/components/Branded';
import { ApiTable } from 'src/components/Common';
import { ButtonsContainer } from 'src/components/Layout';
import { HeaderWithActions, Section } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { useSetUserStatusMutation } from 'src/mutations';
import { useGetMyDetailsQuery } from 'src/queries';
import UserService from 'src/services/user-service';
import { isWorker } from 'src/utils/role-check';
import { InteractiveTableSchema } from 'src/utils/table-schema-utils';
import EditAssign from './EditAssign';

export const List = () => {
  const { data: user } = useGetMyDetailsQuery();
  const { mutate: setUserStatus } = useSetUserStatusMutation();

  const dispatch = useDispatch();

  const scheme = new InteractiveTableSchema(usersList)
    .modifyFieldStatic('status', {
      name: __('application.state'),
      field: 'status',
      mobile: true,
      defaultSort: true,
      type: FieldType.Custom,
      customRender: (value, field, userData: UserListRes) =>
        getLockButton(value, field, userData),
    })
    .addFieldAfter('role', {
      name: __('application.userAssigment'),
      field: 'storageAssign',
      mobile: true,
      type: FieldType.Custom,
      sortable: true,
      customRender: (value, field, userData: UserListRes) =>
        getAssignButton(value, field, userData),
    });

  const getAssignButton = (
    _value: unknown,
    _field: TableSchemaField,
    userData: UserListRes,
  ) => {
    if (isWorker(userData.role)) {
      return (
        <ButtonsContainer max>
          <Button
            text="application.change"
            primary
            click={() =>
              dispatch(showModal(<EditAssign userId={userData.id} />))
            }
          />
        </ButtonsContainer>
      );
    }
    return __('application.notApplicable');
  };

  const getLockButton = (
    _value: unknown,
    field: TableSchemaField,
    userData: UserListRes,
  ) => {
    if (userData.status === UserStatus.blocked) {
      return (
        <ButtonsContainer max>
          <Button
            text="application.active"
            success
            click={() =>
              setUserStatus({ userId: userData.id, status: 'active' })
            }
          />
        </ButtonsContainer>
      );
    }
    return (
      <ButtonsContainer max>
        <Button
          text="application.block"
          danger
          click={() =>
            setUserStatus({ userId: userData.id, status: 'blocked' })
          }
        />
      </ButtonsContainer>
    );
  };

  return (
    <Section>
      <HeaderWithActions
        actions={
          <ButtonsContainer>
            <Button
              text="application.inviteUser"
              primary
              to={`/${UserService.getSlugByRole(user!.role)}/management/users/invite`}
            />
          </ButtonsContainer>
        }
      >
        {__('application.workersList')}
      </HeaderWithActions>

      <ApiTable
        scheme={scheme}
        apiEndpointSubUrl={`user/list/${UserType.staff}`}
      />
    </Section>
  );
};
