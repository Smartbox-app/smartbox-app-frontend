import { darken } from 'polished';
import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import styled, { DefaultTheme } from 'styled-components';

import { getColorForBackground } from 'src/utils/color';

export type FabVariant = 'primary' | 'secondary';

export type FabProps = {
  variant?: FabVariant;
  children: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>;

const getBackground = (variant: FabVariant, theme: DefaultTheme) => {
  if (variant === 'primary') return theme.colors.primary;
  return theme.colors.background.primary;
};

const getIconColor = (variant: FabVariant, theme: DefaultTheme) => {
  if (variant === 'primary') {
    return getColorForBackground(theme.colors.primary);
  }
  return theme.colors.icon.grey.primary;
};

const getHoverBackground = (variant: FabVariant, theme: DefaultTheme) => {
  if (variant === 'primary') return darken(0.1, theme.colors.primary);
  return theme.colors.border.secondary;
};

const getHoverIconColor = (variant: FabVariant, theme: DefaultTheme) => {
  if (variant === 'primary') {
    return getColorForBackground(theme.colors.primary);
  }
  return theme.colors.icon.primary;
};

const StyledFab = styled.button<{ $variant: FabVariant }>(
  ({ theme, $variant }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
    height: 64,
    padding: 0,
    border: 'none',
    borderRadius: '50%',
    background: getBackground($variant, theme),
    boxShadow: theme.shadows.primary,
    cursor: 'pointer',

    svg: {
      fill: getIconColor($variant, theme),
      width: 32,
      height: 32,
    },

    '&:hover': {
      background: getHoverBackground($variant, theme),
      svg: {
        fill: getHoverIconColor($variant, theme),
      },
    },
  }),
);

export const Fab = ({
  variant = 'secondary',
  children,
  type = 'button',
  ...props
}: FabProps) => (
  <StyledFab type={type} $variant={variant} {...props}>
    {children}
  </StyledFab>
);
