import styled from 'styled-components';
import { StockImage } from '../../../../../../../../icons/StockImage';
import { opacify } from 'polished';

export type StorageBackgroundProps = {
  isWarning: boolean;
  isHovered: boolean;
};

const StyledBackground = styled('div')<{
  isWarning: boolean;
  isHovered: boolean;
}>(({ isWarning, theme, isHovered }) => ({
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
  boxShadow: isHovered
    ? `0 0 0 1px ${theme.colors.primary} inset`
    : 'transparent',
  background: isWarning
    ? `linear-gradient(0deg, ${opacify(-0.9, theme.colors.danger)} 0%, ${theme.colors.background.primary} 70%)`
    : theme.colors.background.primary,
  transition: '.3s all',
}));

export const StorageBackground = ({
  isWarning,
  isHovered,
}: StorageBackgroundProps) => {
  return (
    <StyledBackground isWarning={isWarning} isHovered={isHovered}>
      <StockImage />
    </StyledBackground>
  );
};
