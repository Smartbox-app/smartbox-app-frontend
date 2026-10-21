import { Link } from 'react-router-dom';
import { getColorForBackground } from '../../../utils/color';
import styled, { css, DefaultTheme } from 'styled-components';
import { __ } from '../../../helpers/i18n';
import { darken } from 'polished';
import React, {
  ReactNode,
  useEffect,
  useState,
} from 'react';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';

type ButtonTypes = 'primary' | 'secondary' | 'tertiary' | 'error' | 'success';
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
  rawText?: string;
  children?: ReactNode;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
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

const heightBySize = {
  large: 12,
  medium: 10,
  small: 8,
  extrasmall: 6,
};

const getColorByVariant = (variant: ButtonTypes, theme: DefaultTheme) => {
  if (variant === 'primary') return theme.colors.primary;
  if (variant === 'secondary') return theme.colors.background.primary;
  if (variant === 'error') return theme.colors.surface.error.primary;
  if (variant === 'success') return theme.colors.surface.success.primary;
  return 'transparent';
};

const getTextColorByVariant = (variant: ButtonTypes, theme: DefaultTheme) => {
  if (variant === 'error') return theme.colors.background.primary;
  return getColorForBackground(getColorByVariant(variant, theme));
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
  clicked?: boolean;
};

const buttonStyles = css<ButtonStyleProps>(
  ({ theme, variant, size, fullWidth, disabled, clicked }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing * 2,
    fontWeight: 400,
    fontSize: fontSizeBySize[size],
    padding: theme.spacing * paddingMultiplierBySize[size],
    borderRadius: theme.spacing * radiusMultiplierBySize[size],
    background: getColorByVariant(variant, theme),
    color: getTextColorByVariant(variant, theme),
    svg: {
      fill: getTextColorByVariant(variant, theme),
    },
    border: getBorderByVariant(variant, theme),
    textDecoration: getTextDecorationByVariant(variant),
    width: fullWidth ? '100%' : 'auto',
    height: theme.spacing * heightBySize[size],
    minWidth: getMinWidthBySize(size),
    boxShadow: theme.shadows.primary,
    justifyContent: 'center',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: '.3s all, .15s transform',
    transform: clicked ? 'scale(0.6)' : 'scale(1)',
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
      svg: {
        fill: theme.colors.text.disable,
      },
    },
  }),
);

const StyledButton = styled('button')<ButtonStyleProps>(() => buttonStyles);

const StyledA = styled('a')<ButtonStyleProps>(() => buttonStyles);

const StyledLink = styled(Link)<ButtonStyleProps>(() => buttonStyles);

export const Button = ({
  to,
  href,
  type,
  variant = 'primary',
  size = 'small',
  fullWidth,
  disabled,
  onClick,
  iconLeft,
  iconRight,
  text,
  rawText,
  children,
  className,
}: ButtonProps) => {
  const [clicked, setClicked] = useState(false);

  const handleButtonClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    setClicked(true);

    setTimeout(() => {
      if (onClick) onClick(e);
    }, 150);
  };

  const handleLinkClick = () => {
    setClicked(true);
  };

  const handleCapacitorNavigation = (aHref: string) => {
    Browser.open({ url: aHref });
  };

  useEffect(() => {
    if (!clicked) return;

    setTimeout(() => {
      setClicked(false);
    }, 100);
  }, [clicked]);

  if (disabled)
    return (
      <StyledButton
        className={className}
        type={type}
        variant={variant}
        fullWidth={fullWidth}
        size={size}
        disabled={disabled}
      >
        {iconLeft || <span />}
        {children}
        {text ? __(text) : null}
        {iconRight || <span />}
      </StyledButton>
    );
  if (href) {
    if (Capacitor.isNativePlatform()) {
      return (
        <StyledButton
          className={className}
          type={type}
          variant={variant}
          fullWidth={fullWidth}
          onClick={() => handleCapacitorNavigation(href)}
          clicked={clicked}
          size={size}
          disabled={disabled}
        >
          {iconLeft || <span />}
          {children}
          {text ? __(text) : null}
          {iconRight || <span />}
        </StyledButton>
      );
    }
    return (
      <StyledA
        className={className}
        target="_blank"
        href={href}
        variant={variant}
        fullWidth={fullWidth}
        onClick={handleLinkClick}
        size={size}
        disabled={disabled}
        clicked={clicked}
      >
        {iconLeft || <span />}
        {children}
        {text ? __(text) : null}
        {rawText ?rawText: null}
        {iconRight || <span />}
      </StyledA>
    );
  }
  if (to) {
    return (
      <StyledLink
        className={className}
        to={to}
        onClick={handleLinkClick}
        variant={variant}
        fullWidth={fullWidth}
        size={size}
        disabled={disabled}
        clicked={clicked}
      >
        {iconLeft || <span />}
        {children}
        {text ? __(text) : null}
        {rawText ?rawText: null}
        {iconRight || <span />}
      </StyledLink>
    );
  }

  return (
    <StyledButton
      className={className}
      type={type}
      variant={variant}
      fullWidth={fullWidth}
      onClick={handleButtonClick}
      clicked={clicked}
      size={size}
      disabled={disabled}
    >
      {iconLeft || <span />}
      {children}
      {text ? __(text) : null}
      {rawText ?rawText: null}
      {iconRight || <span />}
    </StyledButton>
  );
};
