import styled from 'styled-components';
import {
  ArrowRight,
  ArrowRightHovered,
  Error,
} from '../../../../../../../../icons';

const StyledStorageHeader = styled('header')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing * 2,
  width: '100%',
}));

const StorageStock = styled('div')(({ theme }) => ({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  fontSize: 14,
  color: theme.colors.text.tertiary,
  borderRadius: theme.spacing * 2,
  padding: `${theme.spacing}px ${theme.spacing * 2}px`,
  border: `1px solid ${theme.colors.text.tertiary}`,
}));

const StorageIcon = styled('div')<{ isWarning: boolean }>(
  ({ theme, isWarning }) => ({
    svg: {
      fill: isWarning
        ? theme.colors.surface.error.primary
        : theme.colors.primary,
    },
  }),
);

export type StorageHeaderProps = {
  stockName: string;
  isWarning: boolean;
  hovered: boolean;
};

const getIcon = (isWarning: boolean, isHovered: boolean) => {
  if (isWarning) return <Error />;
  if (isHovered) return <ArrowRightHovered />;
  return <ArrowRight />;
};

export const StorageHeader = ({ stockName, isWarning, isHovered }) => {
  return (
    <StyledStorageHeader>
      <StorageStock>{stockName}</StorageStock>
      <StorageIcon isWarning={isWarning}>
        {getIcon(isWarning, isHovered)}
      </StorageIcon>
    </StyledStorageHeader>
  );
};
