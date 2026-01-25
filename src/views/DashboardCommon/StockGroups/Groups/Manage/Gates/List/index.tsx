import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GateAdminList, UserRole } from 'smartbox-types';
import { gateList } from 'smartbox-tables';
import { showModal } from '../../../../../../../actions/modal';
import { successNotification } from '../../../../../../../actions/notifications';
import ApiService from '../../../../../../../services/api-service';
import { ApiTable, ConfirmModal } from '../../../../../../../components/Common';
import { Button } from '../../../../../../../components/Branded';
import {
  Section,
  ButtonsContainer,
  SimpleHeader,
} from '../../../../../../../components/Layout';
import { __ } from '../../../../../../../helpers/i18n';
import { InteractiveTableSchema } from '../../../../../../../utils/table-schema-utils';
import { refreshApiTableData } from '../../../../../../../actions/api-table';
import { useParams } from 'react-router';
import UserService from '../../../../../../../services/user-service';
import { gate } from '../../../../../../../actions';
import { useGetMyDetailsQuery } from 'src/queries';
import { HeaderWithActions } from 'src/components/ui';

const List = () => {
  const { data: user } = useGetMyDetailsQuery();
  const dispatch = useDispatch();
  const scheme = new InteractiveTableSchema(gateList);
  const { stockGroupId } = useParams<{ stockGroupId: string }>();

  const hasFullAccess = [UserRole.admin, UserRole.client].includes(user!.role);

  scheme.addFieldAtTheEnd({
    name: __('application.actions'),
    field: 'actions',
    mobile: true,
    buttons: [
      {
        name: 'application.openGate',
        type: 'success',
        click: (data: GateAdminList) => openGate(data),
      },
      hasFullAccess
        ? {
            name: 'application.edit',
            type: 'primary',
            to: (data: GateAdminList) =>
              `/${UserService.getSlugByRole(user!.role)}/locations/groups/${stockGroupId}/gates/${data.id}/edit`,
          }
        : null,
      hasFullAccess
        ? {
            name: 'application.delete',
            type: 'danger',
            click: (data: GateAdminList) => confirmGateDelete(data),
          }
        : null,
    ],
  });

  const openGate = (data: GateAdminList) => {
    dispatch(gate.askGateToOpenByStaff(data.id));
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
