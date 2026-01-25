import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { SingleAlarmRes, UserRole } from 'smartbox-types';
import { alarmsList, gateList } from 'smartbox-tables';
import { showModal } from '../../../../../../../actions/modal';

import { ApiTable, ConfirmModal } from '../../../../../../../components/Common';
import { Button, Spinner } from '../../../../../../../components/Branded';
import { Section } from '../../../../../../../components/Layout';
import { __ } from '../../../../../../../helpers/i18n';
import { InteractiveTableSchema } from '../../../../../../../utils/table-schema-utils';
import { refreshApiTableData } from '../../../../../../../actions/api-table';
import { useParams } from 'react-router';
import UserService from '../../../../../../../services/user-service';
import { useGetMyDetailsQuery } from 'src/queries';
import { Header, HeaderWithActions, Typography } from 'src/components/ui';
import ApiService from '../../../../../../../services/api-service';
import { successNotification } from '../../../../../../../actions/notifications';

const List = () => {
  const { data: user } = useGetMyDetailsQuery();
  const dispatch = useDispatch();
  const scheme = new InteractiveTableSchema(alarmsList);
  const { stockId } = useParams<{ stockId: string }>();

  const [loading, setLoading] = useState(false);

  scheme.addFieldAtTheEnd({
    name: __('application.actions'),
    field: 'actions',
    mobile: true,
    buttons: [
      {
        name: 'application.armAlarm',
        type: 'secondary',
        click: (data: SingleAlarmRes) => confirmAlarmArm(data),
      },

      {
        name: 'application.disarmAlarm',
        type: 'secondary',
        click: (data: SingleAlarmRes) => confirmAlarmDisarm(data),
      },
    ],
  });

  const confirmAlarmArm = (data: SingleAlarmRes) => {
    dispatch(
      showModal(
        <ConfirmModal
          mainText="application.confirmAlarmArm"
          approveButtonText="application.yes"
          approveAction={() => armAlarm(data)}
        />,
      ),
    );
  };

  const confirmAlarmDisarm = (data: SingleAlarmRes) => {
    dispatch(
      showModal(
        <ConfirmModal
          mainText="application.confirmAlarmDisarm"
          approveButtonText="application.yes"
          approveAction={() => disarmAlarm(data)}
        />,
      ),
    );
  };

  const armAlarm = async (data: SingleAlarmRes) => {
    setLoading(true);
    await ApiService.callFetch(
      'PATCH',
      `driver/alarm/${stockId}/${data.id}`,
      () => {
        dispatch(successNotification('application.alarmArmedSuccessfully'));
        dispatch(refreshApiTableData());
      },
      null,
      {
        identifier: data.name,
        command: 'arm',
      },
    );
    setLoading(false);
  };

  const disarmAlarm = async (data: SingleAlarmRes) => {
    setLoading(true);
    await ApiService.callFetch(
      'PATCH',
      `driver/alarm/${stockId}/${data.id}`,
      () => {
        dispatch(successNotification('application.alarmDisarmedSuccessfully'));
        dispatch(refreshApiTableData());
      },
      null,
      {
        identifier: data.name,
        command: 'disarm',
      },
    );
    setLoading(false);
  };

  return (
    <Section>
      <Header variant="h2">{__('application.alarmsList')}</Header>
      <Typography>{__('application.alarmsListDescription')}</Typography>
      {loading ? <Spinner halfTransparent overlay /> : null}
      <ApiTable
        scheme={scheme}
        apiEndpointSubUrl={`gate/alarms-list/${stockId}`}
      />
    </Section>
  );
};

export { List };
