import styled from 'styled-components';
import { Calendar, Size } from '../../../../../../../../icons';
import { dateOnly } from '../../../../../../../../utils/format-date';

export type StorageDetailsProps = {
  size: number;
  date: Date;
};

const StyledDetails = styled('footer')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  fontSize: 14,
  gap: theme.spacing * 4,
  fontWeight: 300,
  width: '100%',
  svg: {
    fill: theme.colors.icon.grey.tertiary,
  },
}));

const Detail = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing * 2,
}));

export const StorageDetails = ({ size, date }: StorageDetailsProps) => {
  return (
    <StyledDetails>
      <Detail>
        <Calendar />
        {dateOnly(date)}
      </Detail>
      <Detail>
        <Size />
        <span>{size} m²</span>
      </Detail>
    </StyledDetails>
  );
};
