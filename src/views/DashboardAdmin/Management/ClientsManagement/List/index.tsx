import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';

import {
  FieldType,
  TableSchemaField,
  tenantsList,
} from 'smartbox-tables';
import { UserClientListRes, UserStatus } from 'smartbox-types';
import { showModal } from 'src/actions/modal';
import { Button } from 'src/components/Branded';
import { ApiTable } from 'src/components/Common';
import { ButtonsContainer } from 'src/components/Layout';
import { HeaderWithActions, Section } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { history } from 'src/history';
import { useSetUserStatusMutation } from 'src/mutations';
import { InteractiveTableSchema } from 'src/utils/table-schema-utils';
import { TenantStatus } from '../Status';

const List = () => {
  const dispatch = useDispatch();
  const { mutate: setUserStatus } = useSetUserStatusMutation();

  const scheme = useMemo(() => {
    const getLockButton = (
      _value: unknown,
      field: TableSchemaField,
      userData: UserClientListRes,
    ) => {
      if ([UserStatus.blocked, UserStatus.preActive].includes(userData.status)) {
        return (
          <Button
            text="application.active"
            success
            click={() =>
              setUserStatus({ userId: userData.id, status: 'active' })
            }
          />
        );
      }

      return (
        <Button
          text="application.block"
          danger
          click={() =>
            setUserStatus({ userId: userData.id, status: 'blocked' })
          }
        />
      );
    };

    return new InteractiveTableSchema(tenantsList)
      .modifyFieldStatic('status', {
        name: __('application.state'),
        field: 'status',
        mobile: true,
        defaultSort: true,
        type: FieldType.Custom,
        customRender: (value, field, userData: UserClientListRes) =>
          getLockButton(value, field, userData),
      })
      .addFieldAtTheEnd({
        name: __('application.actions'),
        field: 'actions',
        mobile: true,
        buttons: [
          {
            name: 'application.settings',
            type: 'primary',
            click: (data: UserClientListRes) =>
              history.push(
                `/admin/management/clients/${data.id}/${data.tenantId}/settings`,
              ),
          },
          {
            name: 'application.status',
            type: 'secondary',
            click: (data: UserClientListRes) =>
              dispatch(
                showModal(
                  <TenantStatus tenantId={data.tenantId!} user={data} />,
                ),
              ),
          },
        ],
      });
  }, [dispatch, setUserStatus]);

  return (
    <Section>
      <HeaderWithActions
        actions={
          <ButtonsContainer>
            <Button
              text="application.addTenant"
              primary
              to="/admin/management/clients/add"
            />
          </ButtonsContainer>
        }
      >
        {__('application.tenantsList')}
      </HeaderWithActions>

      <ApiTable scheme={scheme} apiEndpointSubUrl="user/tenants" />
    </Section>
  );
};

export default List;
