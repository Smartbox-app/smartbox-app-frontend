import styled from 'styled-components';

import { LocationDiagnosticsRes } from 'smartbox-types';
import { Header, Section, Stack } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { fullDate } from 'src/utils/format-date';
import { BusDevicesTable } from './BusDevicesTable';
import {
  getDiagnosticsStatusText,
  getInternetTone,
  getWanText,
} from './diagnostics-health';
import {
  DiagnosticsCardsRow,
  DiagnosticsStatusCard,
} from './DiagnosticsStatusCard';

type InternetDiagnosticsProps = {
  internet: NonNullable<LocationDiagnosticsRes>;
};

const Meta = styled.div(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing * 2,
  fontSize: '0.8rem',
}));

const MetaItem = styled.div({
  strong: {
    marginRight: '0.25rem',
  },
});

export const InternetDiagnostics = ({ internet }: InternetDiagnosticsProps) => (
  <Section variant="bordered">
    <Stack>
      <Header variant="h3">{__('application.diagnosticsInternet')}</Header>
      <DiagnosticsCardsRow>
        <DiagnosticsStatusCard
          tone={getInternetTone(internet.status, internet.wan.state)}
          icon="wifi"
          title={getWanText(internet.wan.state)}
        >
          <div>{getDiagnosticsStatusText(internet.status)}</div>
        </DiagnosticsStatusCard>
      </DiagnosticsCardsRow>
      <Meta>
        <MetaItem>
          <strong>{__('application.diagnosticsAsOf')}:</strong>
          {internet.asOf ? fullDate(internet.asOf) : '—'}
        </MetaItem>
        <MetaItem>
          <strong>{__('application.diagnosticsLastContact')}:</strong>
          {internet.lastContactAt ? fullDate(internet.lastContactAt) : '—'}
        </MetaItem>
        <MetaItem>
          <strong>{__('application.diagnosticsWanChangedAt')}:</strong>
          {internet.wan.changedAt ? fullDate(internet.wan.changedAt) : '—'}
        </MetaItem>
      </Meta>
      {internet.bus?.length ? <BusDevicesTable devices={internet.bus} /> : null}
    </Stack>
  </Section>
);
