import React from 'react';

import './History.scss';

interface SingleHistory {
  startData: Date;
  endData: Date;
  size: number;
  location: string;
  isActive: boolean;
}

interface Props {
  data: SingleHistory[];
}

const History = ({ data }: Props) => {
  console.log('data', data);

  const getDate = (x: Date) => x.toLocaleDateString();
  const getShortDate = (x: Date) => x.toLocaleDateString().slice(0, 4);

  const dataToDisplay =
    data &&
    data.map((single: SingleHistory) => (
      <li className={`history-line ${single.isActive ? 'active' : ''}`}>
        <span className="line-cell">
          {getShortDate(single.startData)}-{getDate(single.endData)}
        </span>
        <span className="line-cell small">{single.size}m2</span>
        <span className="line-cell">{single.location}</span>
      </li>
    ));
  return (
    <div className="history-wrapper">
      <ul className="history-list">{dataToDisplay}</ul>
      <div className="history-legend">
        <span className="legend-color" />
        <p className="legend-desc">Aktywne magazyny</p>
      </div>
    </div>
  );
};

export default History;
