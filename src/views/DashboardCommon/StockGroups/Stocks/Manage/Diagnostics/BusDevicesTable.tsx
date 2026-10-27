import styled from 'styled-components';

import { LocationDiagnosticsBusDevice } from 'smartbox-types';
import { Header } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { fullDate } from 'src/utils/format-date';
import { getAnsweringText } from 'src/views/DashboardCommon/StockGroups/Stocks/Manage/Diagnostics/diagnostics-health';

type BusDevicesTableProps = {
  devices: LocationDiagnosticsBusDevice[];
};

const Table = styled.table(({ theme }) => ({
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '0.8rem',
  th: {
    textAlign: 'left',
    padding: theme.spacing,
    borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
    verticalAlign: 'top',
    fontWeight: 600,
  },
  td: {
    textAlign: 'left',
    padding: theme.spacing,
    borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
    verticalAlign: 'top',
  },
}));

export const BusDevicesTable = ({ devices }: BusDevicesTableProps) => (
  <>
    <Header variant="h3">{__('application.diagnosticsBus')}</Header>
    <Table>
      <thead>
        <tr>
          <th>{__('application.diagnosticsBusKind')}</th>
          <th>{__('application.diagnosticsBusMaster')}</th>
          <th>{__('application.diagnosticsBusUnit')}</th>
          <th>{__('application.diagnosticsBusCovers')}</th>
          <th>{__('application.diagnosticsBusAnswering')}</th>
          <th>{__('application.diagnosticsBusLastAnswered')}</th>
        </tr>
      </thead>
      <tbody>
        {devices.map((device) => (
          <tr key={`${device.kind}-${device.master}-${device.unit}`}>
            <td>{device.kind}</td>
            <td>{device.master}</td>
            <td>{device.unit ?? '—'}</td>
            <td>{device.covers.length ? device.covers.join(', ') : '—'}</td>
            <td>{getAnsweringText(device.answering)}</td>
            <td>
              {device.lastAnsweredAt ? fullDate(device.lastAnsweredAt) : '—'}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  </>
);
