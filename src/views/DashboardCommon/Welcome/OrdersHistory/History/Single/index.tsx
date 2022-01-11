import React from 'react';
import { MyRentList, RentStatus } from 'smartbox-types';
import { dateOnly } from '../../../../../../utils/format-date';
import './Single.scss';

export interface SingleHistory {
  startDate: Date;
  endDate: Date;
  size: number;
  location: string;
  isActive: boolean;
}

interface Props {
  single: MyRentList;
}

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

const Single = ({ single }: Props) => (
  <li className={`history-line ${colorStatusCalc(single.status)}`}>
    <span className="line-cell">
      {dateOnly(single.startAt, 5)} - {dateOnly(single.finishAt)}
    </span>
    <span className="line-cell">{single.number}</span>
    <span className="line-cell small">{single.size} m²</span>
    <span className="line-cell last">{single.stockName}</span>
  </li>
);
export default Single;
