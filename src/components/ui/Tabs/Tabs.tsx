import { NavLink } from 'react-router-dom';
import { __ } from 'src/helpers/i18n';
import { SingleTab } from 'src/types/tab';
import styled, { css } from 'styled-components';

export type TabsProps = {
  tabs: SingleTab[];
};

const StyledTabs = styled('div')(({ theme }) => ({
  '@media (min-width: 768px)': {
    display: 'flex',
    gap: theme.spacing * 2,
    flexWrap: 'wrap',
  },
}));

const tabStyles = css<{ active?: boolean }>(({ theme, active }) => ({
  display: 'flex',
  alignItems: 'center',
  // justifyContent: 'center',

  fontSize: 12,
  gap: theme.spacing,
  padding: theme.spacing,
  color: active ? theme.colors.primary : theme.colors.text.primary,
  svg: {
    width: theme.spacing * 5,
    height: theme.spacing * 5,
    fill: active ? theme.colors.primary : theme.colors.text.primary,
  },
  cursor: 'pointer',

  '&:link, &:visited, &:hover, &:active': {
    color: active ? theme.colors.primary : theme.colors.text.primary,
    svg: {
      fill: active ? theme.colors.primary : theme.colors.text.primary,
    },
  },
  '&.active': {
    color: theme.colors.primary,
    borderBottom: `1px solid ${theme.colors.primary}`,
    svg: {
      fill: theme.colors.primary,
    },
  },
  '@media (min-width: 768px)': {
    fontSize: 14,
    padding: theme.spacing * 2,
    borderBottom: `1px solid ${active ? theme.colors.primary : theme.colors.text.primary}`,
  },
}));

const StyledTab = styled('div')(({ theme }) => tabStyles);
const StyledTabLink = styled(NavLink)(({ theme }) => tabStyles);

export const Tabs = ({ tabs }: TabsProps) => {
  return (
    <StyledTabs>
      {tabs.map((tab) =>
        tab.to ? (
          <StyledTabLink to={tab.to} key={tab.text}>
            {tab.icon}
            {__(tab.text)}
          </StyledTabLink>
        ) : (
          <StyledTab
            active={tab.active || false}
            onClick={tab.onClick}
            key={tab.text}
          >
            {tab.icon}
            {__(tab.text)}
          </StyledTab>
        ),
      )}
    </StyledTabs>
  );
};
