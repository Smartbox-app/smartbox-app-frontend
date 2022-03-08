import React from 'react';
import { MyRentList, RentStatus } from 'smartbox-types';
import { dateOnly } from '../../../../../../utils/format-date';
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
    <span className="line-cell created">{dateOnly(single.createdAt)}</span>
    <span className="line-cell period">
      {dateOnly(single.startAt, 5)} - {dateOnly(single.finishAt)}
    </span>
    <span className="line-cell number desktop">{single.number}</span>
    <span className="line-cell size small desktop">{single.size} m²</span>
    <span className="line-cell stock last desktop">{single.stockName}</span>
    <span className="line-cell data last mobile">
      <strong>{single.number}</strong>, {single.size} m², {single.stockName}
    </span>
  </li>
);
export default Single;
