import React from 'react';

interface SingleHistory {
  startData: Date | string;
  endData: Date | string;
  size: number;
  location: string;
}

interface Props {
  data: SingleHistory[];
}

const History = ({ data }: Props) => {
  console.log('data', data);
  const dataToDisplay =
    data &&
    data.map((single: SingleHistory) => (
      <li className="history-line">
        <span>
          {single.startData}-{single.endData}
        </span>
        <span>{single.size}m2</span>
        <span>{single.location}</span>
      </li>
    ));
  return (
    <div className="history-wrapper">
      <ul>{dataToDisplay}</ul>
    </div>
  );
};

export default History;
