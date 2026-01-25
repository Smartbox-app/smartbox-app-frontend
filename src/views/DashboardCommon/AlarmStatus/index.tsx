import React, { useEffect, useState } from 'react';
import { AlarmHealthCheckStatus, AlarmsStatusForAdminRes, SingleAlarmRes,  } from 'smartbox-types';
import { Spinner } from '../../../components/Branded';
import { fullDate } from '../../../utils/format-date';
import ApiService from '../../../services/api-service';

import './AlarmStatus.scss';
import { __ } from '../../../helpers/i18n';
import { useTenantNaming } from 'src/hooks/useTenantNaming';

interface Props {
  stockId?: string;
  stockGroupId?: string;
}

const AlarmStatus = ({ stockId, stockGroupId }: Props) => {
  const [status, setStatus] = useState<AlarmsStatusForAdminRes>();
  const { getText } = useTenantNaming();

  const getStatus = async () => {
    if (stockId) {
      await ApiService.callFetch(
        'GET',
        `gate/alarm-status/stock/${stockId}`,
        (newStatus: AlarmsStatusForAdminRes) => {
          setStatus(newStatus);
        },
      );
    }
    if (stockGroupId) {
      await ApiService.callFetch(
        'GET',
        `gate/alarm-status/group/${stockGroupId}`,
        (newStatus: AlarmsStatusForAdminRes) => {
          setStatus(newStatus);
        },
      );
    }
  };

  useEffect(() => {
    getStatus();

    const int = setInterval(() => {
      getStatus();
    }, 15000);

    return () => {
      clearInterval(int);
    };
  }, []);

  const getStatusClass = (status: AlarmHealthCheckStatus) => {
    switch (status) {
      case AlarmHealthCheckStatus.ConnectionLost:
        return 'connection-lost';
      case AlarmHealthCheckStatus.Slow:
        return 'slow';
      case AlarmHealthCheckStatus.Ok:
        return 'ok';
      default:
        return '';
    }
  };

  const getStatusText = (status: AlarmHealthCheckStatus) => {
    switch (status) {
      case AlarmHealthCheckStatus.ConnectionLost:
        return __('application.lostConnection');
      case AlarmHealthCheckStatus.Slow:
        return __('application.slowConnection');
      case AlarmHealthCheckStatus.Ok:
        return __('application.okConnection');
      default:
        return '';
    }
  };

  const getAlarmStateText = (status: SingleAlarmRes['alarmState']) => {
    switch (status) {
      case 'armed':
        return __('application.alarmArmed');
      case 'disarmed':
        return __('application.alarmDisarmed');
      case 'unknown':
        return __('application.alarmUnknown');
      default:
        return '';
    }
  };

  const getIcon = (status: AlarmHealthCheckStatus) => {
    switch (status) {
      case AlarmHealthCheckStatus.ConnectionLost:
        return 'times-circle';
      case AlarmHealthCheckStatus.Slow:
        return 'exclamation-circle';
      case AlarmHealthCheckStatus.Ok:
        return 'check-circle';
      default:
        return '';
    }
  };

  if (!status) return <Spinner />;

  return (
    <div className="alarm-status">
      {status.map((s) => (
        <div className={`single-status ${getStatusClass(s.status)}`} key={s.id}>
          <div className="status-icon">
            <span className={`fa fa-${getIcon(s.status)}`} />
          </div>
          <div className="status-body">
            <div className="status-id">
              {__('application.alarm')}
              <strong className="status-place-value">{s.id}</strong>
              {getText('on')}
              <strong className="status-place-value">{s.stockName}</strong>
            </div>
            <p className="status-last-connection-label">
              {__('application.lastConnection')}
            </p>
            <div className="status-connection-date">
              {fullDate(s.lastConnection)}
            </div>
            <strong>{getAlarmStateText(s.alarmState)}</strong>
            <div>{getStatusText(s.status)} </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AlarmStatus;
