import React from 'react';
import { useDispatch } from 'react-redux';
import { FieldType, TableSchemaField, usersList } from 'smartbox-tables';
import { IUser, UserStatus, UserType } from 'smartbox-types';
import { ApiTable } from '../../../../components/Common';
import { Button } from '../../../../components/Branded';
import { ButtonsContainer } from '../../../../components/Layout';
import { __ } from '../../../../helpers/i18n';
import { InteractiveTableSchema } from '../../../../utils/table-schema-utils';
import { modal, user } from '../../../../actions';
import { isWorker } from '../../../../utils/role-check';

import EditAssign from './EditAssign';
import { HeaderWithActions, PageHeader, Section } from 'src/components/ui';
import UserService from 'src/services/user-service';
import { showModal } from 'src/actions/modal';
import { blockUser, enableUser } from 'src/actions/users';
import { useGetMyDetailsQuery } from 'src/queries';

export const List = () => {
  const { data: user } = useGetMyDetailsQuery();

  const dispatch = useDispatch();

  const scheme = new InteractiveTableSchema(usersList)
    .modifyFieldStatic('status', {
      name: __('application.state'),
      field: 'status',
      mobile: true,
      defaultSort: true,
      type: FieldType.Custom,
      customRender: (value, field, userData) =>
        getLockButton(value, field, userData),
    })
    .addFieldAfter('role', {
      name: __('application.userAssigment'),
      field: 'storageAssign',
      mobile: true,
      type: FieldType.Custom,
      sortable: true,
      customRender: (value, field, userData) =>
        getAssignButton(value, field, userData),
    });

  const getAssignButton = (
    value: any,
    field: TableSchemaField,
    userData: IUser,
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
    } else {
      return __('application.notApplicable');
    }
  };

  const getLockButton = (
    value: boolean,
    field: TableSchemaField,
    userData: IUser,
  ) => {
    if (userData.status === UserStatus.blocked) {
      return (
        <ButtonsContainer max>
          <Button
            text="application.active"
            success
            click={() => dispatch(enableUser(userData.id))}
          />
        </ButtonsContainer>
      );
    } else {
      return (
        <ButtonsContainer max>
          <Button
            text="application.block"
            danger
            click={() => dispatch(blockUser(userData.id))}
          />
        </ButtonsContainer>
      );
    }
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
