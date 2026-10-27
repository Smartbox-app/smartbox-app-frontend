import React, { useEffect, useState } from 'react';

import { GateHealthCheckStatus, GatesStatusForAdminRes } from 'smartbox-types';
import { Skeleton } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { useTenantNaming } from 'src/hooks/useTenantNaming';
import ApiService from 'src/services/api-service';
import { fullDate } from 'src/utils/format-date';

import 'src/views/DashboardCommon/GateStatus/GateStatus.scss';

interface Props {
  stockId?: string;
  stockGroupId?: string;
}

const GateStatus = ({ stockId, stockGroupId }: Props) => {
  const [status, setStatus] = useState<GatesStatusForAdminRes>();
  const { getText } = useTenantNaming();

  const getStatus = async () => {
    if (stockId) {
      await ApiService.callFetch(
        'GET',
        `gate/status/stock/${stockId}`,
        (newStatus: GatesStatusForAdminRes) => {
          setStatus(newStatus);
        },
      );
    }
    if (stockGroupId) {
      await ApiService.callFetch(
        'GET',
        `gate/status/group/${stockGroupId}`,
        (newStatus: GatesStatusForAdminRes) => {
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

  const getStatusClass = (status: GateHealthCheckStatus) => {
    switch (status) {
      case GateHealthCheckStatus.ConnectionLost:
        return 'connection-lost';
      case GateHealthCheckStatus.Slow:
        return 'slow';
      case GateHealthCheckStatus.Ok:
        return 'ok';
      default:
        return '';
    }
  };

  const getStatusText = (status: GateHealthCheckStatus) => {
    switch (status) {
      case GateHealthCheckStatus.ConnectionLost:
        return __('application.lostConnection');
      case GateHealthCheckStatus.Slow:
        return __('application.slowConnection');
      case GateHealthCheckStatus.Ok:
        return __('application.okConnection');
      default:
        return '';
    }
  };

  const getIcon = (status: GateHealthCheckStatus) => {
    switch (status) {
      case GateHealthCheckStatus.ConnectionLost:
        return 'times-circle';
      case GateHealthCheckStatus.Slow:
        return 'exclamation-circle';
      case GateHealthCheckStatus.Ok:
        return 'check-circle';
      default:
        return '';
    }
  };

  if (!status)
    return (
      <div className="gate-status">
        <Skeleton radius={2} height={83} width="350px" />
      </div>
    );
  if (!status || status.length === 0) return null;

  return (
    <div className="gate-status">
      {status.map((s) => (
        <div className={`single-status ${getStatusClass(s.status)}`} key={s.id}>
          <div className="status-icon">
            <span className={`fa fa-${getIcon(s.status)}`} />
          </div>
          <div className="status-body">
            <div className="status-id">
              {__('application.gate')}
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
            <div>{s.isOpen}</div>

            <div>{getStatusText(s.status)} </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GateStatus;
