import { AriaRole, ReactNode } from 'react';
import styled from 'styled-components';

import { CardBackground } from 'src/components/ui/Card/components/CardBackground';

const StyledCard = styled('div')(({ theme }) => ({
  borderRadius: theme.radius.innerSurface,
  background: theme.colors.background.primary,
  boxShadow: theme.shadows.primary,
  padding: `${theme.spacing * 4}px ${theme.spacing * 4}px`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  overflow: 'hidden',
  gap: theme.spacing * 3,
  position: 'relative',
  zIndex: 1,
  flex: 1,
  minHeight: 150,
  cursor: 'pointer',
  transition: '.3s all',
  height: '100%',
}));

export type CardProps = {
  warning?: boolean;
  notice?: boolean;
  disabled?: boolean;
  hovered?: boolean;
  active?: boolean;
  image?: ReactNode;
  children?: ReactNode;
  role?: AriaRole;
  'aria-label'?: string;
  className?: string;
};

export const Card = ({
  warning,
  disabled,
  hovered,
  notice,
  image,
  active,
  children,
  role,
  className,
  'aria-label': ariaLabel,
}: CardProps) => {
  return (
    <StyledCard role={role} aria-label={ariaLabel} className={className}>
      <CardBackground
        image={image}
        disabled={disabled}
        hovered={hovered}
        warning={warning}
        notice={notice}
        active={active}
      />
      {children}
    </StyledCard>
  );
};
