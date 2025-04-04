import { Link } from 'react-router-dom';
import { getColorForBackground } from '../../../utils/color';
import styled, { css, DefaultTheme } from 'styled-components';
import { __ } from '../../../helpers/i18n';
import { darken } from 'polished';
import { ReactNode } from 'react';

type ButtonTypes = 'primary' | 'secondary' | 'tertiary';
type ButtonSizes = 'large' | 'medium' | 'small' | 'extrasmall';

export type ButtonProps = {
  type?: 'button' | 'submit';
  href?: string;
  to?: string;
  variant?: ButtonTypes;
  size?: ButtonSizes;
  fullWidth?: boolean;
  disabled?: boolean;
  text?: string;
  icon?: ReactNode;
  onClick?: () => void;
};

const paddingMultiplierBySize = {
  large: 4,
  medium: 4,
  small: 3,
  extrasmall: 2,
};

const radiusMultiplierBySize = {
  large: 6,
  medium: 5,
  small: 4,
  extrasmall: 3,
};

const fontSizeBySize = {
  large: 16,
  medium: 16,
  small: 14,
  extrasmall: 12,
};

const getColorByVariant = (variant: ButtonTypes, theme: DefaultTheme) => {
  if (variant === 'primary') return theme.colors.primary;
  if (variant === 'secondary') return theme.colors.background.primary;
  return 'transparent';
};

const getBorderByVariant = (variant: ButtonTypes, theme: DefaultTheme) => {
  if (variant === 'secondary')
    return `1px solid ${theme.colors.border.secondary}`;
  return 'none';
};

const getTextDecorationByVariant = (variant: ButtonTypes) => {
  if (variant === 'tertiary') return 'underline';
  return 'none';
};

const getMinWidthBySize = (size: ButtonSizes) => {
  if (size === 'large') return 250;
  return undefined;
};

type ButtonStyleProps = {
  variant: ButtonTypes;
  size: ButtonSizes;
  disabled?: boolean;
  fullWidth?: boolean;
};

const buttonStyles = css<ButtonStyleProps>(
  ({ theme, variant, size, fullWidth, disabled }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing * 2,
    fontWeight: 400,
    fontSize: fontSizeBySize[size],
    padding: theme.spacing * paddingMultiplierBySize[size],
    borderRadius: theme.spacing * radiusMultiplierBySize[size],
    background: getColorByVariant(variant, theme),
    color: getColorForBackground(getColorByVariant(variant, theme)),
    svg: {
      fill: getColorForBackground(getColorByVariant(variant, theme)),
    },
    border: getBorderByVariant(variant, theme),
    textDecoration: getTextDecorationByVariant(variant),
    width: fullWidth ? '100%' : 'auto',
    minWidth: getMinWidthBySize(size),
    boxShadow: theme.shadows.primary,
    justifyContent: 'center',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: '.3s all',
    '&:link': {
      color: getColorForBackground(getColorByVariant(variant, theme)),
    },
    '&:visited': {
      color: getColorForBackground(getColorByVariant(variant, theme)),
    },
    '&:hover': {
      background: darken(0.1, getColorByVariant(variant, theme)),
    },
    '&:active': {
      color: getColorForBackground(getColorByVariant(variant, theme)),
    },
    '&:disabled': {
      background: theme.colors.surface.primary.disable,
      color: theme.colors.text.disable,
      border: 'none',
    },
  }),
);

const StyledButton = styled('button')<ButtonStyleProps>(
  ({ theme }) => buttonStyles,
);

const StyledA = styled('a')<ButtonStyleProps>(({ theme }) => buttonStyles);

const StyledLink = styled(Link)<ButtonStyleProps>(({ theme }) => buttonStyles);

export const Button = ({
  to,
  href,
  type,
  variant = 'primary',
  size = 'small',
  fullWidth,
  disabled,
  onClick,
  icon,
  text,
}: ButtonProps) => {
  if (disabled || onClick)
    return (
      <StyledButton
        type={type}
        onClick={onClick}
        variant={variant}
        fullWidth={fullWidth}
        size={size}
        disabled={disabled}
      >
        {icon}
        {text ? __(text) : null}
      </StyledButton>
    );
  if (href) {
    return (
      <StyledA
        href={href}
        variant={variant}
        fullWidth={fullWidth}
        size={size}
        disabled={disabled}
      >
        {icon}
        {text ? __(text) : null}
      </StyledA>
    );
  }
  if (to) {
    return (
      <StyledLink
        to={to}
        variant={variant}
        fullWidth={fullWidth}
        size={size}
        disabled={disabled}
      >
        {icon}
        {text ? __(text) : null}
      </StyledLink>
    );
  }

  return null;
};
