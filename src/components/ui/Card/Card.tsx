import { useState } from 'react';
import styled from 'styled-components';

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
}));

export const Card = () => {
  const [isHovered, setHovered] = useState(false);

  const handleHover = () => {
    setHovered(true);
  };

  const handleBlur = () => {
    setHovered(false);
  };

  return <StyledCard></StyledCard>;
};
