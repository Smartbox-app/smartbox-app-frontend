import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { __ } from '../../../helpers/i18n';

type SidebarButtonStyleProps = {
  $small?: boolean;
};

const sidebarButtonStyles = css<SidebarButtonStyleProps>(({ theme, $small }) => ({
  padding: `${theme.spacing * ($small ? 1 : 2)}px ${theme.spacing * ($small ? 2 : 4)}px`,
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
  minHeight: $small ? 32 : 42,
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
  flex: $small ? '0 0 auto' : 1,

  '@media(min-width: 768px)': {
    flex: $small ? '0 0 auto' : '0 1 auto',
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

const StyledSidebarButton = styled('button')<SidebarButtonStyleProps>(
  () => sidebarButtonStyles,
);
const StyledSidebarLink = styled(NavLink)<SidebarButtonStyleProps>(
  () => sidebarButtonStyles,
);

export type SidebarButtonProps = {
  to?: string;
  icon?: ReactNode;
  text?: string;
  children?: ReactNode;
  small?: boolean;
  onClick?: () => void;
};

export const SidebarButton = ({
  to,
  icon,
  text,
  children,
  onClick,
  small,
}: SidebarButtonProps) => {
  if (to)
    return (
      <StyledSidebarLink to={to} $small={small}>
        {icon}
        {children}
        {text ? __(text) : null}
      </StyledSidebarLink>
    );
  return (
    <StyledSidebarButton onClick={onClick} $small={small}>
      {icon}
      {children}
      {text ? __(text) : null}
    </StyledSidebarButton>
  );
};
