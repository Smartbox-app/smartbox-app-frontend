import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { __ } from '../../../helpers/i18n';

const sidebarButtonStyles = css(({ theme }) => ({
  padding: `${theme.spacing * 2}px ${theme.spacing * 4}px`,
  background: theme.colors.background.primary,
  border: `1px solid ${theme.colors.background.primary}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing * 2,
  color: theme.colors.text.primary,
  borderRadius: theme.radius.outerSurface,
  cursor: 'pointer',
  boxShadow: theme.shadows.primary,
  fontSize: 14,
  svg: {
    fill: theme.colors.icon.grey.primary,
    transition: '.3s all'
  },
  '&:hover': {
    border: `1px solid ${theme.colors.primary}`,
    svg: {
      fill: theme.colors.icon.primary,
    },
  },
  transition: '.3s all'
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
