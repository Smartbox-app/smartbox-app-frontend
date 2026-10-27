import { AlarmsStatusForAdminRes } from 'smartbox-types';
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

type AlarmsDiagnosticsProps = {
  alarms: AlarmsStatusForAdminRes;
};

export const AlarmsDiagnostics = ({ alarms }: AlarmsDiagnosticsProps) => {
  if (!alarms.length) return null;

  return (
    <Section variant="bordered">
      <Stack>
        <Header variant="h3">{__('application.diagnosticsAlarms')}</Header>
        <DiagnosticsCardsRow>
          {alarms.map((alarm) => (
            <DiagnosticsStatusCard
              key={alarm.id}
              tone={getHealthTone(alarm.status)}
              icon={getHealthIcon(alarm.status)}
              title={alarm.name}
            >
              <div>
                {__('application.lastConnection')}:{' '}
                {fullDate(alarm.lastConnection)}
              </div>
              <div>{getHealthText(alarm.status)}</div>
              <div>{alarm.alarmState}</div>
            </DiagnosticsStatusCard>
          ))}
        </DiagnosticsCardsRow>
      </Stack>
    </Section>
  );
};
