import React from 'react';
import Single, { SingleHistory } from './Single';

import './History.scss';
import Legend from './Legend';

interface Props {
  data: SingleHistory[];
}

const History = ({ data }: Props) => {
  const dataToDisplay =
    data && data.map((single: SingleHistory, key: number) => <Single single={single} key={`history-${key}`} />);

  return (
    <div className="history-wrapper">
      <ul className="history-list">{dataToDisplay}</ul>
      <Legend />
    </div>
  );
};

export default History;
