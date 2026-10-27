import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';

import { alarmsList } from 'smartbox-tables';
import { SingleAlarmRes } from 'smartbox-types';
import { refreshApiTableData } from 'src/actions/api-table';
import { showModal } from 'src/actions/modal';
import { successNotification } from 'src/actions/notifications';
import { Spinner } from 'src/components/Branded';
import { ApiTable, ConfirmModal } from 'src/components/Common';
import { Section } from 'src/components/Layout';
import { Header, Typography } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import ApiService from 'src/services/api-service';
import { InteractiveTableSchema } from 'src/utils/table-schema-utils';
import { LocationActivityList } from 'src/views/DashboardCommon/StockGroups/Stocks/Manage/Alarms/LocationActivityList';

const List = () => {
  const dispatch = useDispatch();
  const scheme = new InteractiveTableSchema(alarmsList);
  const { stockId } = useParams<{ stockId: string }>();

  const [actionLoading, setActionLoading] = useState(false);

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
    setActionLoading(true);
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
    setActionLoading(false);
  };

  const disarmAlarm = async (data: SingleAlarmRes) => {
    setActionLoading(true);
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
    setActionLoading(false);
  };

  return (
    <>
      <Section>
        {actionLoading ? <Spinner halfTransparent overlay /> : null}
        <Header variant="h2">{__('application.alarmsList')}</Header>
        <Typography>{__('application.alarmsListDescription')}</Typography>
        <ApiTable
          scheme={scheme}
          apiEndpointSubUrl={`gate/alarms-list/${stockId}`}
        />
      </Section>
      <LocationActivityList />
    </>
  );
};

export { List };
