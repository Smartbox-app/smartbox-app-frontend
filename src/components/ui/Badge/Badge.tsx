import { ReactNode } from 'react';
import { getColorForBackground } from 'src/utils/color';
import styled, { DefaultTheme } from 'styled-components';

type BadgeVariants = 'default' | 'primary' | 'secondary';

export type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariants;
  bold?: boolean;
};

const getColor = (
  variant: BadgeVariants,
  bold: boolean,
  theme: DefaultTheme,
) => {
  if (variant === 'primary') return getColorForBackground(theme.colors.primary);
  if (bold) return theme.colors.text.primary;
  return theme.colors.text.tertiary;
};

const StyledBadge = styled('div')<{ variant: BadgeVariants; bold: boolean }>(
  ({ theme, variant, bold }) => ({
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontSize: 14,
    fontWeight: bold ? 500 : 400,
    borderRadius: theme.spacing * 2,
    padding: `${theme.spacing}px ${theme.spacing * 2}px`,
    background:
      variant === 'default'
        ? theme.colors.background.primary
        : theme.colors.primary,
    color: getColor(variant, bold, theme),
    border:
      variant === 'default'
        ? `1px solid ${theme.colors.text.tertiary}`
        : `1px solid ${theme.colors.primary}`,
  }),
);

export const Badge = ({
  variant = 'default',
  bold = false,
  children,
}: BadgeProps) => {
  return (
    <StyledBadge variant={variant} bold={bold}>
      {children}
    </StyledBadge>
  );
};
