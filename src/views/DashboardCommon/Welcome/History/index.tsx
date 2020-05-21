import React from 'react';
import Single, { SingleHistory } from './Single';

import './History.scss';

interface Props {
  data: SingleHistory[];
}

const History = ({ data }: Props) => {
  const dataToDisplay =
    data && data.map((single: SingleHistory, key: number) => <Single single={single} key={`history-${key}`} />);

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
