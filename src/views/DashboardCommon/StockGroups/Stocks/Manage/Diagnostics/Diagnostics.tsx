import { useParams } from 'react-router';
import styled from 'styled-components';

import { Spinner } from 'src/components/Branded';
import { Header, Section, Stack } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import {
  useAlarmsStatusForStockQuery,
  useGatesStatusForStockQuery,
  useLocationDiagnosticsQuery,
} from 'src/queries';
import { AlarmsDiagnostics } from 'src/views/DashboardCommon/StockGroups/Stocks/Manage/Diagnostics/AlarmsDiagnostics';
import { GatesDiagnostics } from 'src/views/DashboardCommon/StockGroups/Stocks/Manage/Diagnostics/GatesDiagnostics';
import { InternetDiagnostics } from 'src/views/DashboardCommon/StockGroups/Stocks/Manage/Diagnostics/InternetDiagnostics';

const POLL_MS = 60_000;

const Empty = styled.p(({ theme }) => ({
  color: theme.colors.text.secondary,
  fontSize: '0.875rem',
  margin: 0,
}));

export const Diagnostics = () => {
  const { stockId } = useParams<{ stockId: string }>();
  const poll = { refetchInterval: POLL_MS };

  const gatesQuery = useGatesStatusForStockQuery(stockId, poll);
  const alarmsQuery = useAlarmsStatusForStockQuery(stockId, poll);
  const internetQuery = useLocationDiagnosticsQuery(stockId, poll);

  if (gatesQuery.isPending || alarmsQuery.isPending || internetQuery.isPending) {
    return <Spinner />;
  }

  const gates = gatesQuery.data ?? [];
  const alarms = alarmsQuery.data ?? [];
  const internet = internetQuery.data ?? null;

  const hasAny = Boolean(internet) || gates.length > 0 || alarms.length > 0;

  return (
    <Section>
      <Stack>
        <Header variant="h2">{__('application.diagnostics')}</Header>
        {!hasAny ? <Empty>{__('application.diagnosticsEmpty')}</Empty> : null}
        <GatesDiagnostics gates={gates} />
        {internet ? <InternetDiagnostics internet={internet} /> : null}
       
        <AlarmsDiagnostics alarms={alarms} />
      </Stack>
    </Section>
  );
};
