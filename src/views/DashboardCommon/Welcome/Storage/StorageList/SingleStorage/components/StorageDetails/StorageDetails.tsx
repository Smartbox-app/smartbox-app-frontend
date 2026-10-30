import styled from 'styled-components';

import { RentAgreementType } from 'smartbox-types';
import { useRent } from 'src/hooks/useRent';
import { Calendar, Size } from 'src/icons';

export type StorageDetailsProps = {
  size: number;
  date?: Date | string | null;
  agreementType?: RentAgreementType | null;
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

export const StorageDetails = ({
  size,
  date,
  agreementType,
}: StorageDetailsProps) => {
  const { formatFinishAt } = useRent();
  return (
    <StyledDetails>
      <Detail>
        <Calendar />
        {formatFinishAt(date, agreementType)}
      </Detail>
      <Detail>
        <Size />
        <span>{size} m²</span>
      </Detail>
    </StyledDetails>
  );
};
