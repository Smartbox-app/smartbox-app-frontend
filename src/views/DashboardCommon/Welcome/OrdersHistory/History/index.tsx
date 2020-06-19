import React from 'react';
import { MyRentList } from 'smartbox-types';
import Single, { SingleHistory } from './Single';

import Legend from './Legend';

import './History.scss';
import { Alert } from '../../../../../components/Common';

interface Props {
  data: MyRentList[];
}

const History = ({ data }: Props) => {
  const dataToDisplay =
    data.length > 0 ? (
      data.map((single: MyRentList, key: number) => <Single single={single} key={`history-${key}`} />)
    ) : (
      <Alert type="notice" text="Brak historii wynajmu" />
    );

  return (
    <div className="history-wrapper">
      <ul className="history-list">{dataToDisplay}</ul>
      <Legend />
    </div>
  );
};

export default History;
