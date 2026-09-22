import React from 'react';
import { useDispatch } from 'react-redux';
import { GateAdminList, UserRole } from 'smartbox-types';
import { FieldType, gateList } from 'smartbox-tables';
import { showModal } from '../../../../../../../actions/modal';
import { successNotification } from '../../../../../../../actions/notifications';
import ApiService from '../../../../../../../services/api-service';
import { ApiTable, ConfirmModal } from '../../../../../../../components/Common';
import { Button } from '../../../../../../../components/Branded';
import {
  Section,
  ButtonsContainer,
} from '../../../../../../../components/Layout';
import { __ } from '../../../../../../../helpers/i18n';
import { InteractiveTableSchema } from '../../../../../../../utils/table-schema-utils';
import { refreshApiTableData } from '../../../../../../../actions/api-table';
import { useParams } from 'react-router';
import UserService from '../../../../../../../services/user-service';
import { gate } from '../../../../../../../actions';
import { useGetMyDetailsQuery } from 'src/queries';
import { HeaderWithActions, Typography } from 'src/components/ui';

const List = () => {
  const { data: user } = useGetMyDetailsQuery();
  const dispatch = useDispatch();
  const scheme = new InteractiveTableSchema(gateList);
  const { stockId } = useParams<{ stockId: string }>();

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
          click={() => openGate(data)}
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
            to={`/${UserService.getSlugByRole(user!.role)}/locations/stocks/${stockId}/gates/${data.id}/edit`}
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

  const openGate = (data: GateAdminList) => {
    dispatch(gate.askGateToOpenByStaff(data.id));
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
          hasFullAccess && (
            <ButtonsContainer>
              <Button
                text="application.addGate"
                primary
                to={`/${UserService.getSlugByRole(user!.role)}/locations/stocks/${stockId}/gates/add`}
              />
            </ButtonsContainer>
          )
        }
      >
        {__('application.gatesList')}
      </HeaderWithActions>
      <Typography>{__('application.gatesListDescription')}</Typography>
      <Typography>{__('application.gatesListAlarmDescription')}</Typography>
      <ApiTable
        scheme={scheme}
        apiEndpointSubUrl={`gate/list/stock/${stockId}`}
      />
    </Section>
  );
};

export { List };
