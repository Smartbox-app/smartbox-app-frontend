import React from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';

import { FieldType, gateList } from 'smartbox-tables';
import { GateAdminList, UserRole } from 'smartbox-types';
import { refreshApiTableData } from 'src/actions/api-table';
import { showModal } from 'src/actions/modal';
import { successNotification } from 'src/actions/notifications';
import { Button } from 'src/components/Branded';
import { ApiTable, ConfirmModal } from 'src/components/Common';
import {
  Section,
  ButtonsContainer,
} from 'src/components/Layout';
import { HeaderWithActions, Typography } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { useOpenGateMutation } from 'src/mutations';
import { useGetMyDetailsQuery } from 'src/queries';
import ApiService from 'src/services/api-service';
import UserService from 'src/services/user-service';
import { InteractiveTableSchema } from 'src/utils/table-schema-utils';

const List = () => {
  const { data: user } = useGetMyDetailsQuery();
  const dispatch = useDispatch();
  const { mutate: openGate } = useOpenGateMutation();
  const scheme = new InteractiveTableSchema(gateList);
  const { stockGroupId } = useParams<{ stockGroupId: string }>();

  const hasFullAccess = [UserRole.admin, UserRole.client].includes(user!.role);

  scheme.addFieldAtTheEnd({
    name: __('application.actions'),
    field: 'actions',
    type: FieldType.Custom,
    mobile: true,
    customRender: (_value, _field, data: GateAdminList) => (
      <ButtonsContainer noWrap>
        <Button
          success
          text="application.openGate"
          click={() => openGateByStaff(data)}
        />
        {hasFullAccess && data.hasKeypad && data.passcode ? (
          <Button
            secondary
            text="application.resetPasscode"
            click={() => confirmResetPasscode(data)}
          />
        ) : null}
        {hasFullAccess ? (
          <Button
            primary
            text="application.edit"
            to={`/${UserService.getSlugByRole(user!.role)}/locations/groups/${stockGroupId}/gates/${data.id}/edit`}
          />
        ) : null}
        {hasFullAccess ? (
          <Button
            danger
            text="application.delete"
            click={() => confirmGateDelete(data)}
          />
        ) : null}
      </ButtonsContainer>
    ),
  });

  const openGateByStaff = (data: GateAdminList) => {
    openGate({ gateId: data.id, mode: 'staff' });
  };

  const confirmResetPasscode = (data: GateAdminList) => {
    dispatch(
      showModal(
        <ConfirmModal
          mainText="application.confirmResetPasscode"
          approveButtonText="application.yes"
          approveAction={() => resetPasscode(data)}
        />,
      ),
    );
  };

  const resetPasscode = async (data: GateAdminList) => {
    await ApiService.callFetch('PATCH', `gate/${data.id}/passcode/reset`, () => {
      dispatch(successNotification('application.passcodeReset'));
      dispatch(refreshApiTableData());
    });
  };

  const confirmGateDelete = (data: GateAdminList) => {
    dispatch(
      showModal(
        <ConfirmModal
          mainText="application.confirmGateDelete"
          approveButtonText="application.yes"
          approveAction={() => deleteGate(data)}
        />,
      ),
    );
  };

  const deleteGate = async (data: GateAdminList) => {
    await ApiService.callFetch('DELETE', `gate/${data.id}`, () => {
      dispatch(successNotification('application.gateDeleted'));
      dispatch(refreshApiTableData());
    });
  };

  return (
    <Section>
      <HeaderWithActions
        actions={
          hasFullAccess ? (
            <ButtonsContainer>
              <Button
                text="application.addGate"
                primary
                to={`/${UserService.getSlugByRole(user!.role)}/locations/groups/${stockGroupId}/gates/add`}
              />
            </ButtonsContainer>
          ) : null
        }
      >
        {__('application.gatesList')}
      </HeaderWithActions>
      <Typography>{__('application.gatesListDescription')}</Typography>
      <Typography>{__('application.gatesListAlarmDescription')}</Typography>
      <ApiTable
        scheme={scheme}
        apiEndpointSubUrl={`gate/list/group/${stockGroupId}`}
      />
    </Section>
  );
};

export { List };
