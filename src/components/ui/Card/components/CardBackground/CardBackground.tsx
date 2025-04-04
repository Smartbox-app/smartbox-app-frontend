import { opacify } from 'polished';
import { ReactNode } from 'react';
import styled from 'styled-components';

export type CardBackgroundProps = {
  warning: boolean;
  hovered: boolean;
  disabled: boolean;
  image?: ReactNode;
};

const StyledBackground = styled('div')<{
  warning: boolean;
  hovered: boolean;
}>(({ warning, theme, hovered }) => ({
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
  boxShadow: hovered
    ? `0 0 0 1px ${theme.colors.primary} inset`
    : 'transparent',
  background: warning
    ? `linear-gradient(0deg, ${opacify(-0.9, theme.colors.danger)} 0%, ${theme.colors.background.primary} 70%)`
    : theme.colors.background.primary,
  transition: '.3s all',
}));

export const StorageBackground = ({
  warning,
  hovered,
  image,
}: CardBackgroundProps) => {
  return (
    <StyledBackground warning={warning} hovered={hovered}>
      {image}
    </StyledBackground>
  );
};
