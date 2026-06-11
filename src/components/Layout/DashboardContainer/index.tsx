import React, { ReactNode, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Footer } from '../index';
import './DashboardContainer.scss';
import styled from 'styled-components';
import { PageContent } from 'src/components/Branded';
import { List } from 'src/icons';
import { __ } from 'src/helpers/i18n';
import { AppMessage } from 'src/components/AppMessage';

interface Props {
  children: ReactNode;
  sidebar?: ReactNode;
}

const StyledDashboardShell = styled.div({
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  width: '100%',
  height: '100dvh',
  minHeight: '100vh',
});

const StyledDashboardContent = styled.div({
  display: 'flex',
  flexDirection: 'row',
  overflow: 'hidden',
  height: '100%',
  flex: 1,
});

const StyledSidebarBackdrop = styled.button<{ $visible: boolean }>(
  ({ $visible }) => ({
    display: 'none',
    '@media (max-width: 767px)': {
      display: 'block',
      position: 'fixed',
      inset: 0,
      zIndex: 999,
      margin: 0,
      padding: 0,
      border: 'none',
      background: 'rgba(1, 18, 34, 0.45)',
      cursor: 'pointer',
      opacity: $visible ? 1 : 0,
      pointerEvents: $visible ? 'auto' : 'none',
      transition: 'opacity 0.2s ease',
    },
  }),
);

const StyledSidebarSlot = styled.div<{ $open: boolean }>(({ $open }) => ({
  flexShrink: 0,
  '@media (max-width: 767px)': {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 1000,
    width: 'min(320px, 85vw)',
    transform: $open ? 'translateX(0)' : 'translateX(-100%)',
    transition: 'transform 0.2s ease',
  },
}));

const StyledMobileMenuFab = styled.div(({ theme }) => ({
  display: 'none',
  '@media (max-width: 767px)': {
    display: 'block',
    position: 'fixed',
    right: `calc(${theme.spacing * 3}px + env(safe-area-inset-right))`,
    bottom: `calc(${theme.spacing * 3}px + env(safe-area-inset-bottom))`,
    zIndex: 100,
  },
}));

const StyledMenuButton = styled.button(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 64,
  height: 64,
  padding: 0,
  border: 'none',
  borderRadius: '50%',
  background: theme.colors.background.primary,
  boxShadow: theme.shadows.primary,
  cursor: 'pointer',

  svg: {
    fill: theme.colors.icon.grey.primary,
    width: 32,
    height: 32,
  },

  '&:hover': {
    background: theme.colors.border.secondary,
    svg: {
      fill: theme.colors.icon.primary,
    },
  },
}));

const StyledPageContentArea = styled.div({
  flex: 1,
  minWidth: 0,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  width: '100%',
});

const StyledDashboardContainer = styled('div')<{ $fullScreen: boolean }>(
  ({ theme, $fullScreen }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing * 4,
    width: '100%',
    flex: 1,
    minHeight: 0,
    ...($fullScreen
      ? {
          padding: theme.spacing * 4,
          paddingBottom: theme.spacing * 4,
          '@media (max-width: 767px)': {
            paddingBottom: theme.spacing * 16,
          },
          overflow: 'auto',
        }
      : {
          paddingBottom: theme.spacing * 24,
          '@media (min-width: 768px)': {
            paddingBottom: 0,
          },
        }),
  }),
);

export const DashboardContainer = ({ children, sidebar }: Props) => {
  const isManagementDashboard = !!sidebar;
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  const pageContent = (
    <PageContent
      variant={isManagementDashboard ? 'dashboard' : 'default'}
      conditionalBg
    >
      <StyledDashboardContainer $fullScreen={isManagementDashboard}>
        {children}
        <Footer />
      </StyledDashboardContainer>
    </PageContent>
  );

  if (!isManagementDashboard) {
    return (
      <>
        <AppMessage />
        {pageContent}
      </>
    );
  }

  return (
    <StyledDashboardShell>
      <AppMessage />
      <StyledDashboardContent>
        <StyledSidebarBackdrop
          type="button"
          $visible={mobileNavOpen}
          aria-hidden={!mobileNavOpen}
          tabIndex={mobileNavOpen ? 0 : -1}
          onClick={() => setMobileNavOpen(false)}
        />
        <StyledSidebarSlot $open={mobileNavOpen}>{sidebar}</StyledSidebarSlot>
        <StyledPageContentArea>{pageContent}</StyledPageContentArea>
        <StyledMobileMenuFab>
          <StyledMenuButton
            type="button"
            aria-expanded={mobileNavOpen}
            aria-label={__('application.management')}
            onClick={() => setMobileNavOpen((open) => !open)}
          >
            <List />
          </StyledMenuButton>
        </StyledMobileMenuFab>
      </StyledDashboardContent>
    </StyledDashboardShell>
  );
};
