import { ReactNode } from 'react';
import { darken } from 'polished';
import styled, { DefaultTheme } from 'styled-components';

import { DiagnosticsTone } from 'src/views/DashboardCommon/StockGroups/Stocks/Manage/Diagnostics/diagnostics-health';

type DiagnosticsStatusCardProps = {
  tone: DiagnosticsTone;
  icon: string;
  title: ReactNode;
  children: ReactNode;
};

const toneColor = (tone: DiagnosticsTone, theme: DefaultTheme) => {
  if (tone === 'danger') return theme.colors.danger;
  if (tone === 'warning') return theme.colors.tertiary;
  return theme.colors.success;
};

export const DiagnosticsCardsRow = styled.div(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing * 2,
}));

const Card = styled.div<{ $tone: DiagnosticsTone }>(({ theme, $tone }) => {
  const bg = toneColor($tone, theme);
  return {
    color: '#fff',
    display: 'flex',
    flex: '1 1 280px',
    fontSize: '0.7rem',
    minWidth: 0,
    backgroundColor: bg,
  };
});

const Icon = styled.div<{ $tone: DiagnosticsTone }>(({ theme, $tone }) => ({
  padding: theme.spacing * 2,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  backgroundColor: darken(0.05, toneColor($tone, theme)),
}));

const Body = styled.div(({ theme }) => ({
  padding: theme.spacing * 2,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
}));

const Title = styled.div({
  fontWeight: 500,
  marginBottom: '0.25rem',
});

export const DiagnosticsStatusCard = ({
  tone,
  icon,
  title,
  children,
}: DiagnosticsStatusCardProps) => (
  <Card $tone={tone}>
    <Icon $tone={tone}>
      <span className={`fa fa-${icon}`} />
    </Icon>
    <Body>
      <Title>{title}</Title>
      {children}
    </Body>
  </Card>
);
