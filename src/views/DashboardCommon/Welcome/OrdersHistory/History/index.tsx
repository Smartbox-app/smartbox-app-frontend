import React from 'react';
import { MyRentList } from 'smartbox-types';
import Single from './Single';
import { Alert } from '../../../../../components/Common';
import { __ } from '../../../../../helpers/i18n';

import Legend from './Legend';

import './History.scss';

interface Props {
  data: MyRentList[];
}

const History = ({ data }: Props) => {
  const dataToDisplay =
    data.length > 0 ? (
      data.map((single: MyRentList, key: number) => <Single single={single} key={`history-${key}`} />)
    ) : (
      <Alert type="notice" text="application.lackOfHistory" />
    );

  return (
    <div className="history-wrapper">
      <div className="history-line header">
        <span className="header-cell period">{__('application.period')}</span>
        <span className="header-cell number">{__('application.number')}</span>
        <span className="header-cell size">{__('application.orderStepSize')}</span>
        <span className="header-cell stock last">{__('application.stock')}</span>
      </div>
      <ul className="history-list">{dataToDisplay}</ul>
      <Legend />
    </div>
  );
};

export default History;
