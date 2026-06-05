import styled from 'styled-components';
import { NestedSidebarNav } from 'src/components/ui/NestedSidebarNav';
import { SidebarNavGroup } from 'src/types/sidebar-nav';
import { Logo, LogoContainer } from 'src/components/Branded';
import { Logout } from 'src/icons';
import { useLogoutMutation } from 'src/mutations';
import { __ } from 'src/helpers/i18n';
import React from 'react';

export type DashboardSidebarProps = {
  groups: SidebarNavGroup[];
  bottom?: React.ReactNode;
};

const StyledDashboardSidebar = styled.aside(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing * 4,
  width: '100%',
  height: '100%',
  minHeight: '100vh',
  flexShrink: 0,
  overflow: 'auto',
  padding: theme.spacing * 2,
  paddingTop: `calc(${theme.spacing * 2}px + env(safe-area-inset-top))`,
  paddingBottom: `calc(${theme.spacing * 2}px + env(safe-area-inset-bottom))`,
  background: theme.colors.background.primary,
  boxShadow: theme.shadows.primary,

  '@media (min-width: 768px)': {
    width: 240,
    height: '100vh',
    minHeight: '100vh',
    padding: theme.spacing * 4,
    paddingTop: `calc(${theme.spacing * 4}px + env(safe-area-inset-top))`,
    paddingBottom: `calc(${theme.spacing * 4}px + env(safe-area-inset-bottom))`,
    boxShadow: 'none',
    borderRight: `1px solid ${theme.colors.border.secondary}`,
  },
}));

const StyledLogo = styled.div({
  display: 'none',
  '@media (min-width: 768px)': {
    display: 'block',
  },
});

const StyledLogoutButton = styled.button(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing * 2,
  marginTop: 'auto',
  padding: `${theme.spacing * 2}px ${theme.spacing * 3}px`,
  paddingLeft: theme.spacing * 2,
  fontSize: 14,
  lineHeight: '20px',
  color: theme.colors.text.primary,
  background: 'transparent',
  border: 'none',
  borderRadius: theme.radius.innerSurface,
  cursor: 'pointer',
  textAlign: 'left',

  svg: {
    fill: theme.colors.icon.grey.primary,
    width: theme.spacing * 5,
    height: theme.spacing * 5,
  },

  '&:hover': {
    background: theme.colors.border.secondary,
    color: theme.colors.danger,
    svg: {
      fill: theme.colors.danger,
    },
  },

  '@media (max-width: 767px)': {
    marginTop: theme.spacing * 2,
  },
}));

export const DashboardSidebar = ({ groups, bottom }: DashboardSidebarProps) => {
  const { mutate: logout } = useLogoutMutation();

  return (
    <StyledDashboardSidebar>
      <Logo width="small" />
      <NestedSidebarNav groups={groups} />
      {bottom}
      <StyledLogoutButton type="button" onClick={() => logout()}>
        <Logout />
        {__('application.logout')}
      </StyledLogoutButton>
    </StyledDashboardSidebar>
  );
};
