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
        <span className="header-cell created">{__('application.createdAt')}</span>
        <span className="header-cell period">{__('application.period')}</span>
        <span className="header-cell number desktop">{__('application.number')}</span>
        <span className="header-cell size desktop">{__('application.orderStepSize')}</span>
        <span className="header-cell stock last desktop">{__('application.stock')}</span>
        <span className="header-cell data last mobile">{__('application.orderInfo')}</span>
      </div>
      <ul className="history-list">{dataToDisplay}</ul>
      <Legend />
    </div>
  );
};

export default History;
