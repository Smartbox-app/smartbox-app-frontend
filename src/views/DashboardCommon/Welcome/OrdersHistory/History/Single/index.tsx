import React from 'react';
import { dateOnly } from '../../../../../../utils/format-date';

export interface SingleHistory {
  startDate: Date;
  endDate: Date;
  size: number;
  location: string;
  isActive: boolean;
}

interface Props {
  single: SingleHistory;
}

const Single = ({ single }: Props) => (
  <li className={`history-line ${single.isActive ? 'active' : ''}`}>
    <span className="line-cell">
      {dateOnly(single.startDate, 5)}-{dateOnly(single.endDate)}
    </span>
    <span className="line-cell small">{single.size}m2</span>
    <span className="line-cell">{single.location}</span>
  </li>
);
export default Single;
