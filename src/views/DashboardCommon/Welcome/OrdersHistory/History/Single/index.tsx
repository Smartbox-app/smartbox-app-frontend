import React from 'react';
import { MyRentList, RentStatus } from 'smartbox-types';
import { dateOnly } from '../../../../../../utils/format-date';
import { Button } from '../../../../../../components/Common';

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
  <li className={`history-line ${single.status === RentStatus.rented ? 'active' : ''}`}>
    <span className="line-cell">
      {dateOnly(single.startAt, 5)}-{dateOnly(single.finishAt)}
    </span>
    <span className="line-cell small">{single.size}m2</span>
    <span className="line-cell">{single.stockName}</span>
    <Button text="Generuj" primary small />
  </li>
);
export default Single;
