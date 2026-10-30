import React from 'react';
import styled from 'styled-components';

import { MyRentList, RentStatus } from 'smartbox-types';
import { useRent } from 'src/hooks/useRent';
import { colorOrDark } from 'src/utils/color';
import { dateOnly } from 'src/utils/format-date';

import './Single.scss';

export interface SingleHistory {
  createdAt: Date;
  startDate: Date;
  endDate: Date;
  size: number;
  location: string;
  isActive: boolean;
}

interface Props {
  single: MyRentList;
}

const StyledLine = styled.li`
  &.active-stock {
    color: ${({ theme }) => colorOrDark(theme.colors.primary)}
  }
`

const colorStatusCalc = (s: string): string => {
  switch (s) {
    case RentStatus.rented: {
      return 'active-stock';
    }
    case RentStatus.failure: {
      return 'payment-issue';
    }
    case RentStatus.finished: {
      return 'ended';
    }
    default:
      return '';
  }
};

const Single = ({ single }: Props) => {
  const { formatFinishAt, resolveRentFinishAt } = useRent();

  return (
  <StyledLine className={`history-line ${colorStatusCalc(single.status)}`}>
    <span className="line-cell period">
      {dateOnly(single.startAt, 5)} - {formatFinishAt(resolveRentFinishAt(single), single.agreementType)}
    </span>
    <span className="line-cell number">{single.number}</span>
    <span className="line-cell size small">{single.size} m²</span>
    <span className="line-cell stock last">{single.stockName}</span>
  </StyledLine>
  );
};
export default Single;
