import React from 'react';
import { MyRentList } from 'smartbox-types';
import { dateOnly } from '../../../../../../utils/format-date';

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

const Single = ({ single }: Props) => (
  <li className={`history-line ${single.id ? 'active' : ''}`}>
    <span className="line-cell">
      {dateOnly(single.startAt, 5)}-{dateOnly(single.finishAt)}
    </span>
    <span className="line-cell small">{single.size}m2</span>
    <span className="line-cell">{single.stockName}</span>
  </li>
);
export default Single;
