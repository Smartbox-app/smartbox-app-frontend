import { GatesStatusForAdminRes } from 'smartbox-types';
import { Header, Section, Stack } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { fullDate } from 'src/utils/format-date';
import {
  getHealthIcon,
  getHealthText,
  getHealthTone,
} from 'src/views/DashboardCommon/StockGroups/Stocks/Manage/Diagnostics/diagnostics-health';
import {
  DiagnosticsCardsRow,
  DiagnosticsStatusCard,
} from 'src/views/DashboardCommon/StockGroups/Stocks/Manage/Diagnostics/DiagnosticsStatusCard';

type GatesDiagnosticsProps = {
  gates: GatesStatusForAdminRes;
};

export const GatesDiagnostics = ({ gates }: GatesDiagnosticsProps) => {
  if (!gates.length) return null;

  return (
    <Section variant="bordered">
      <Stack>
        <Header variant="h3">{__('application.diagnosticsGates')}</Header>
        <DiagnosticsCardsRow>
          {gates.map((gate) => (
            <DiagnosticsStatusCard
              key={gate.id}
              tone={getHealthTone(gate.status)}
              icon={getHealthIcon(gate.status)}
              title={
                <>
                  {__('application.gate')} {gate.id}
                </>
              }
            >
              <div>
                {__('application.lastConnection')}:{' '}
                {fullDate(gate.lastConnection)}
              </div>
              <div>{getHealthText(gate.status)}</div>
            </DiagnosticsStatusCard>
          ))}
        </DiagnosticsCardsRow>
      </Stack>
    </Section>
  );
};
