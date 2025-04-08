import { ReactNode } from 'react';
import { __ } from 'src/helpers/i18n';
import styled from 'styled-components';

export type TabsProps = {
  tabs: {
    icon: ReactNode;
    onClick: () => void;
    active: boolean;
    text: string;
  }[];
};

const StyledTabs = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing
}));

const StyledTab = styled('div')<{ active: boolean }>(({ theme, active }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 14,
  gap: theme.spacing,
  padding: `${theme.spacing}px ${theme.spacing * 2}px`,
  color: active ? theme.colors.primary : theme.colors.text.primary,
  svg: {
    fill: active ? theme.colors.primary : theme.colors.text.primary,
  },
  cursor: 'pointer',
  borderBottom: `1px solid ${active ? theme.colors.primary : theme.colors.text.primary}`,
}));

export const Tabs = ({ tabs }: TabsProps) => {
  return (
    <StyledTabs>
      {tabs.map((tab) => (
        <StyledTab active={tab.active} onClick={tab.onClick} key={tab.text}>
          {tab.icon}
          {__(tab.text)}
        </StyledTab>
      ))}
    </StyledTabs>
  );
};
