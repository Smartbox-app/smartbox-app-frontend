import React, { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { FieldType } from 'smartbox-tables';
import { TTGatewayLockDeviceList, TTLockDeviceList } from 'smartbox-types';
import { showModal } from 'src/actions/modal';
import { successNotification } from 'src/actions/notifications';
import { Alert, ApiTable } from 'src/components/Common';
import { Header, Section } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import ApiService from 'src/services/api-service';
import { gatewayLocksList } from 'src/smartbox-tables/schemas/gateway-lock-list.table';
import { locksList } from 'src/smartbox-tables/schemas/locks-list.table';
import { InteractiveTableSchema } from 'src/utils/table-schema-utils';
import { LockDetails } from './components/LockDetails/LockDetails';
import { history } from 'src/history';
import { Spinner } from 'src/components/Branded';

export const Locks = () => {
  const dispatch = useDispatch();
  const { type, groupOrGatewayId } = useParams<{
    type?: string;
    groupOrGatewayId?: string;
  }>();
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const scheme = new InteractiveTableSchema(
    type === 'gateway' ? gatewayLocksList : locksList,
  );

  scheme
    .modifyFieldStatic('electricQuantity', {
      name: __('application.batteryStatus'),
      field: 'electricQuantity',
      mobile: true,
      defaultSort: true,
      type: FieldType.Custom,
      customRender: (value, field, lock: TTLockDeviceList) => {
        if (lock.electricQuantity > 80)
          return (
            <Alert compact type="success">
              {lock.electricQuantity}%
            </Alert>
          );
        if (lock.electricQuantity > 30)
          return (
            <Alert compact type="warning">
              {lock.electricQuantity}%
            </Alert>
          );
        return (
          <Alert compact type="error">
            {lock.electricQuantity}%
          </Alert>
        );
      },
    })
    .addFieldAtTheEnd({
      name: __('application.actions'),
      field: 'actions',
      mobile: true,
      buttons: [
        {
          name: 'application.lockDetails',
          type: 'primary',
          click: (data: TTLockDeviceList) => openDetails(data),
        },
        {
          name: 'application.lockPasscodes',
          type: 'secondary',
          click: (data: TTLockDeviceList) => history.push(`/admin/drivers/locks/${data.lockId}/passcodes`),
        },
        {
          name: 'application.unlock',
          type: 'success',
          click: (data: TTLockDeviceList) => openLock(data),
        },
        {
          name: 'application.lock',
          type: 'error',
          click: (data: TTLockDeviceList) => closeLock(data),
        },
      ],
    });

    if(type ==='gateway') {
      scheme.modifyFieldStatic('rssi', {
      name: 'Sygnał bramki',
      field: 'rssi',
      mobile: true,
      defaultSort: true,
      type: FieldType.Custom,
      customRender: (value, field, lock: TTGatewayLockDeviceList) => {
        if (lock.rssi > -75)
          return (
            <Alert compact type="success">
              Silny&nbsp;({lock.rssi})
            </Alert>
          );
        if (lock.electricQuantity > -85)
          return (
            <Alert compact type="warning">
              Średni&nbsp;({lock.rssi})
            </Alert>
          );
        return (
          <Alert compact type="error">
            Słaby&nbsp;({lock.rssi})
          </Alert>
        );
      },
    })
    }

    const openDetails = (lock: TTLockDeviceList) => {
      dispatch(showModal(<LockDetails id={lock.lockId} />))
    }

  const openLock = async (data: TTLockDeviceList) => {
    setActionLoading(true);
    await ApiService.callFetch('PATCH', `driver/open/${data.lockId}`, () => {
      dispatch(successNotification('application.lockOpened'));
    });
    setActionLoading(false);
  };

  const closeLock = async (data: TTLockDeviceList) => {
    setActionLoading(true);
    await ApiService.callFetch('PATCH', `driver/close/${data.lockId}`, () => {
      dispatch(successNotification('application.lockClosed'));
    });
    setActionLoading(false);
  };

  const url = useMemo(() => {
    if (!type) return 'driver/locks';
    if (type === 'group') return `driver/locks/by-group/${groupOrGatewayId}`;
    if (type === 'gateway')
      return `driver/locks/by-gateway/${groupOrGatewayId}`;
    return '';
  }, [type, groupOrGatewayId]);

  return (
    <Section>
      {actionLoading ? <Spinner halfTransparent overlay /> : null}
      <Header variant="h2">{__('application.locks')}</Header>
      <ApiTable
        scheme={scheme}
        apiEndpointSubUrl={url || 'driver/locks'}
      />
    </Section>
  );
};
