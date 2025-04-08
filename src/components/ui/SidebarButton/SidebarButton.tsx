import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { __ } from '../../../helpers/i18n';

const sidebarButtonStyles = css(({ theme }) => ({
  padding: `${theme.spacing * 2}px ${theme.spacing * 4}px`,
  background: theme.colors.background.primary,
  border: `1px solid ${theme.colors.background.primary}`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing * 2,
  color: theme.colors.text.primary,
  borderRadius: theme.radius.outerSurface,
  cursor: 'pointer',

  fontSize: 14,
  svg: {
    fill: theme.colors.icon.grey.primary,
    transition: '.3s all',
  },
  '&:link, &:visited': {
    svg: {
      fill: theme.colors.icon.grey.primary,
    },
    color: theme.colors.text.primary,
  },
  '&:hover': {
    border: `1px solid ${theme.colors.primary}`,
    svg: {
      fill: theme.colors.icon.primary,
    },
  },
  '&.active': {
    background: theme.colors.primary,
    color: theme.colors.background.white,
    svg: {
      fill: theme.colors.background.white,
    },
  },
  transition: '.3s all',
  flex: 1,

  '@media(min-width: 500px)': {
    flex: '0 1 auto',
    flexDirection: 'row',
    boxShadow: theme.shadows.primary,
    '&:hover': {
      border: `1px solid ${theme.colors.primary}`,
      svg: {
        fill: theme.colors.icon.primary,
      },
    },
    '&.active': {
      background: theme.colors.background.primary,
      border: `1px solid ${theme.colors.background.primary}`,
      color: theme.colors.primary,
      svg: {
        fill: theme.colors.icon.primary,
      },
    },
  },
}));

const StyledSidebarButton = styled('button')(() => sidebarButtonStyles);
const StyledSidebarLink = styled(NavLink)(() => sidebarButtonStyles);

export type SidebarButtonProps = {
  to?: string;
  icon: ReactNode;
  text: string;
  onClick?: () => void;
};

export const SidebarButton = ({
  to,
  icon,
  text,
  onClick,
}: SidebarButtonProps) => {
  if (to)
    return (
      <StyledSidebarLink to={to}>
        {icon}
        {__(text)}
      </StyledSidebarLink>
    );
  return (
    <StyledSidebarButton onClick={onClick}>
      {icon}
      {__(text)}
    </StyledSidebarButton>
  );
};
