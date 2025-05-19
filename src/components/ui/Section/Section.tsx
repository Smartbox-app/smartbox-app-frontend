import { ReactNode } from 'react';
import styled, { DefaultTheme } from 'styled-components';

type SectionVariants = 'default' | 'transparent';
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
  padding: `${theme.spacing * 6}px ${theme.spacing * 4}px`,
  boxShadow: getShadowByVariant(variant, theme),
  borderRadius: theme.radius.outerSurface,
  gap: theme.spacing * 4,
  alignItems: align === 'center' ? 'center' : undefined,
  width: getWidth(width),
  margin: '0 auto',
  '@media(min-width: 768px)': {
    padding: theme.spacing * 8,
  }
}));

export type SectionProps = {
  variant?: 'default' | 'transparent';
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
