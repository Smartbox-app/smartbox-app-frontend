import { ReactNode } from 'react';
import styled, { DefaultTheme } from 'styled-components';

type SectionVariants = 'default' | 'transparent' | 'bordered';
type SectionWidths = 'full' | 'half';
type SectionDirections = 'horizontal' | 'vertical';
type SectionAlignments = 'center' | 'default';

const getBackgroundByVariant = (
  variant: SectionVariants,
  theme: DefaultTheme,
) => {  
  if (variant === 'transparent') return 'transparent';
  return theme.colors.background.white;
};

const getBorderByVariant = (
  variant: SectionVariants,
  _theme: DefaultTheme,
) => {  
  if (variant === 'bordered') return `1px solid rgba(0, 0, 0, 0.08)`;
  return 'none';
};

const getShadowByVariant = (variant: SectionVariants, theme: DefaultTheme) => {
  if (variant === 'transparent') return 'none';
  return theme.shadows.primary;
};

const getWidth = (width: SectionWidths) => {
  if (width === 'full') return '100%';
  return '50%';
};

const StyledSection = styled('section')<{
  variant: SectionVariants;
  width: SectionWidths;
  direction: SectionDirections;
  align: SectionAlignments
}>(({ theme, variant, width, direction, align }) => ({
  display: 'flex',
  flexDirection: direction === 'vertical' ? 'column' : 'row',
  background: getBackgroundByVariant(variant, theme),
  padding: `${theme.spacing * 5}px ${theme.spacing * 4}px`,
  boxShadow: getShadowByVariant(variant, theme),
  borderRadius: theme.radius.innerSurface,
  border: getBorderByVariant(variant, theme),
  gap: theme.spacing * 6,
  alignItems: align === 'center' ? 'center' : undefined,
  width: getWidth(width),
  margin: '0 auto',
  '@media(min-width: 768px)': {
    padding: theme.spacing * 8,
    borderRadius: theme.radius.outerSurface,
  }
}));

export type SectionProps = {
  variant?: 'default' | 'transparent' | 'bordered';
  direction?: 'horizontal' | 'vertical';
  width?: SectionWidths;
  align?: SectionAlignments;
  children: ReactNode;
  className?: string;
};

export const Section = ({
  children,
  direction = 'vertical',
  width = 'full',
  variant = 'default',
  align = 'default',
  className
}: SectionProps) => {
  return (
    <StyledSection width={width} variant={variant} direction={direction} align={align} className={className}>
      {children}
    </StyledSection>
  );
};
