import { GatesStatusForAdminRes } from 'smartbox-types';
import { Header, Section, Stack } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { fullDate } from 'src/utils/format-date';

import {
  getHealthIcon,
  getHealthText,
  getHealthTone,
} from './diagnostics-health';
import {
  DiagnosticsCardsRow,
  DiagnosticsStatusCard,
} from './DiagnosticsStatusCard';

type GatesDiagnosticsProps = {
  gates: GatesStatusForAdminRes;
  openById?: Record<string, boolean | null>;
};

const gateOpenText = (isOpen: boolean | null) => {
  if (isOpen === true) return __('application.diagnosticsOpen');
  if (isOpen === false) return __('application.diagnosticsClosed');
  return __('application.diagnosticsUnknown');
};

export const GatesDiagnostics = ({ gates, openById }: GatesDiagnosticsProps) => {
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
              {openById && gate.id in openById ? (
                <div>
                  {__('application.diagnosticsDoorState')}:{' '}
                  {gateOpenText(openById[gate.id])}
                </div>
              ) : null}
              <div>{getHealthText(gate.status)}</div>
            </DiagnosticsStatusCard>
          ))}
        </DiagnosticsCardsRow>
      </Stack>
    </Section>
  );
};
