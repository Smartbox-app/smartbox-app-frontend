import React from 'react';
import styled from 'styled-components';

const StyledAction = styled.a(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing * 2,
  padding: `${theme.spacing * 2}px ${theme.spacing * 3}px`,
  borderRadius: 999,
  background: theme.colors.background.primary,
  boxShadow: theme.shadows.primary,
  color: theme.colors.text.primary,
  textDecoration: 'none',
  fontSize: 14,
  fontWeight: 500,
  whiteSpace: 'nowrap',

  span: {
    fontSize: 18,
    color: theme.colors.icon.primary,
  },

  '&:hover': {
    background: theme.colors.border.secondary,
  },
}));

export type ActionProps = {
  href: string;
  label: string;
  iconClassName: string;
};

export const Action = ({ href, label, iconClassName }: ActionProps) => (
  <StyledAction href={href} rel="noopener noreferrer">
    <span className={`fa ${iconClassName}`} aria-hidden />
    {label}
  </StyledAction>
);
