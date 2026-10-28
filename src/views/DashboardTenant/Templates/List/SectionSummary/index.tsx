import { ReactNode } from 'react';
import styled from 'styled-components';

import { TemplateListRow } from 'smartbox-types';
import { ChannelStatus } from '../ChannelStatus';
import { TemplateLanguageSection, TemplateSection } from '../types';

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
  'details[open] > summary &::before': {
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
  'details[open] > summary &': {
    display: 'none',
  },
});

const ExpandSummary = ({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) => (
  <Summary>
    <TitleRow>
      <Marker aria-hidden />
      <Title>{title}</Title>
    </TitleRow>
    {children ? <Info>{children}</Info> : null}
  </Summary>
);

type SectionSummaryProps = {
  section: TemplateSection<TemplateListRow>;
};

export const SectionSummary = ({ section }: SectionSummaryProps) => {
  const email = section.languages.flatMap((language) => language.email);
  const sms = section.languages.flatMap((language) => language.sms);

  return (
    <ExpandSummary title={section.label}>
      {email.length > 0 && <ChannelStatus channel="email" groups={email} />}
      {sms.length > 0 && <ChannelStatus channel="sms" groups={sms} />}
    </ExpandSummary>
  );
};

type LanguageSummaryProps = {
  language: TemplateLanguageSection<TemplateListRow>;
};

export const LanguageSummary = ({ language }: LanguageSummaryProps) => (
  <ExpandSummary title={language.lang.toUpperCase()}>
    {language.email.length > 0 && (
      <ChannelStatus channel="email" groups={language.email} />
    )}
    {language.sms.length > 0 && (
      <ChannelStatus channel="sms" groups={language.sms} />
    )}
  </ExpandSummary>
);
