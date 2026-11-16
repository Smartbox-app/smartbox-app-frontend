import styled from 'styled-components';

import {
  LocationDiagnosticsDoor,
  LocationDiagnosticsDoorState,
} from 'smartbox-types';
import { Header, Section, Stack } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { fullDate } from 'src/utils/format-date';

type DoorsDiagnosticsProps = {
  doors: LocationDiagnosticsDoor[] | null;
  syncedAt: Date | string | null;
};

const Table = styled.table(({ theme }) => ({
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '0.8rem',
  th: {
    textAlign: 'left',
    padding: theme.spacing,
    borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
    fontWeight: 600,
  },
  td: {
    textAlign: 'left',
    padding: theme.spacing,
    borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
  },
}));

const Note = styled.p(({ theme }) => ({
  color: theme.colors.text.secondary,
  fontSize: '0.875rem',
  margin: 0,
}));

export const doorStateText = (state: LocationDiagnosticsDoorState) => {
  switch (state) {
    case 'open':
      return __('application.diagnosticsOpen');
    case 'closed':
      return __('application.diagnosticsClosed');
    default:
      return __('application.diagnosticsUnknown');
  }
};

export const DoorsDiagnostics = ({ doors, syncedAt }: DoorsDiagnosticsProps) => (
  <Section variant="bordered">
    <Stack>
      <Header variant="h3">{__('application.diagnosticsDoors')}</Header>
      {syncedAt ? (
        <Note>
          {__('application.diagnosticsAsOf')}: {fullDate(syncedAt)}
        </Note>
      ) : null}
      {doors == null ? (
        <Note>{__('application.diagnosticsDoorUnavailable')}</Note>
      ) : doors.length === 0 ? (
        <Note>{__('application.diagnosticsNoDoors')}</Note>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>{__('application.diagnosticsDoorName')}</th>
              <th>{__('application.diagnosticsDoorState')}</th>
              <th>{__('application.diagnosticsDoorObserved')}</th>
            </tr>
          </thead>
          <tbody>
            {doors.map((door) => (
              <tr key={door.lockId}>
                <td>{door.identifier || door.lockId}</td>
                <td>{doorStateText(door.state)}</td>
                <td>{door.observedAt ? fullDate(door.observedAt) : '—'}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Stack>
  </Section>
);
