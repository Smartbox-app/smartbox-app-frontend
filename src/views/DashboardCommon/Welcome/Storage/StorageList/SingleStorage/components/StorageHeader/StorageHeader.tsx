import styled from 'styled-components';
import {
  ArrowRightCircle,
  ArrowRightCircleHovered,
  Error,
} from '../../../../../../../../icons';
import { Badge } from 'src/components/ui';

const StyledStorageHeader = styled('header')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing * 2,
  width: '100%',
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
  if (isHovered) return <ArrowRightCircleHovered />;
  return <ArrowRightCircle />;
};

export const StorageHeader = ({ stockName, isWarning, isHovered }) => {
  return (
    <StyledStorageHeader>
      <Badge>{stockName}</Badge>
      <StorageIcon isWarning={isWarning}>
        {getIcon(isWarning, isHovered)}
      </StorageIcon>
    </StyledStorageHeader>
  );
};
