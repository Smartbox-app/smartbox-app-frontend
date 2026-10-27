import styled from 'styled-components';

import { TemplateListRow } from 'smartbox-types';
import { ChannelStatus } from 'src/views/DashboardTenant/Templates/List/ChannelStatus';
import { TemplateSection } from 'src/views/DashboardTenant/Templates/List/types';

const Summary = styled('summary')({
  cursor: 'pointer',
  listStyle: 'none',
  '&::-webkit-details-marker': {
    display: 'none',
  },
  '&::marker': {
    content: 'none',
  },
});

const TitleRow = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing,
}));

const Marker = styled('span')(({ theme }) => ({
  color: theme.colors.text.secondary,
  fontSize: '0.75rem',
  lineHeight: 1,
  '&::before': {
    content: '"▸"',
  },
  'details[open] &::before': {
    content: '"▾"',
  },
}));

const Title = styled('h3')(({ theme }) => ({
  margin: 0,
  fontSize: '1rem',
  lineHeight: '1.375rem',
  fontWeight: 400,
  color: theme.colors.text.secondary,
}));

const Info = styled('div')({
  'details[open] &': {
    display: 'none',
  },
});

type SectionSummaryProps = {
  section: TemplateSection<TemplateListRow>;
};

export const SectionSummary = ({ section }: SectionSummaryProps) => (
  <Summary>
    <TitleRow>
      <Marker aria-hidden />
      <Title>{section.label}</Title>
    </TitleRow>
    <Info>
      {section.email.length > 0 && (
        <ChannelStatus channel="email" groups={section.email} />
      )}
      {section.sms.length > 0 && (
        <ChannelStatus channel="sms" groups={section.sms} />
      )}
    </Info>
  </Summary>
);
