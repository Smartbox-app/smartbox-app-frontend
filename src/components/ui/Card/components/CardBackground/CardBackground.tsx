import { opacify } from 'polished';
import { ReactNode } from 'react';
import styled, { DefaultTheme } from 'styled-components';

export type CardBackgroundProps = {
  warning?: boolean;
  hovered?: boolean;
  disabled?: boolean;
  active?: boolean;
  image?: ReactNode;
};

const getBackground = (
  disabled: boolean,
  warning: boolean,
  active: boolean,
  theme: DefaultTheme,
) => {
  if (disabled)
    return `linear-gradient(0deg, ${opacify(-0.9, theme.colors.disabled)} 0%, ${theme.colors.background.primary} 70%)`;
  if (warning)
    return `linear-gradient(0deg, ${opacify(-0.9, theme.colors.danger)} 0%, ${theme.colors.background.primary} 70%)`;
  if (active)
    return `linear-gradient(0deg, ${opacify(-0.9, theme.colors.primary)} 0%, ${theme.colors.background.primary} 70%)`;
  return theme.colors.background.primary;
};

const getBoxShadow = (
  disabled: boolean,
  hovered: boolean,
  warning: boolean,
  active: boolean,
  theme: DefaultTheme,
) => {
  if (disabled) return undefined;
  if (warning) return `0 0 0 1px ${theme.colors.danger} inset`;
  if (active) return `0 0 0 1px ${theme.colors.primary} inset`;
  if (hovered) return `0 0 0 1px ${theme.colors.primary} inset`;

  return undefined;
};

const StyledBackground = styled('div')<{
  warning: boolean;
  hovered: boolean;
  active: boolean;
  disabled: boolean;
}>(({ warning, theme, active, hovered, disabled }) => ({
  position: 'absolute',
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
  zIndex: -1,
  padding: theme.spacing * 4,
  borderRadius: theme.spacing * 4,
  svg: {
    fill: '#f8f8f7',
    width: '100%',
    height: '100%',
    marginLeft: '10%',
  },
  boxShadow: getBoxShadow(disabled, hovered, warning, active, theme),
  background: getBackground(disabled, warning, active, theme),
  transition: '.3s all',
}));

export const CardBackground = ({
  warning = false,
  hovered = false,
  active = false,
  disabled = false,
  image,
}: CardBackgroundProps) => {
  return (
    <StyledBackground warning={warning} hovered={hovered} active={active} disabled={disabled}>
      {image}
    </StyledBackground>
  );
};
