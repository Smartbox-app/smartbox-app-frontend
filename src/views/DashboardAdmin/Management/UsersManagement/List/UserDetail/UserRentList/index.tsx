import React from 'react';
import { RentStatus } from 'smartbox-types';
import { Alert } from '../../../../../../../components/Common';
import { dateOnly } from '../../../../../../../utils/format-date';

import './UserRentList.scss';

interface Props {
  rentList: any[];
}

const UserRentList = ({ rentList }: Props) => {
  if (rentList.length === 0) {
    return <Alert type="notice" text={'Brak wynajęć'} />;
  }

  const data = rentList.map((s: any) => {
    return (
      <div className="single-rent" key={s}>
        <p className="box-rent">{s.number}</p>
        <p className="dates-rent">
          {dateOnly(s.startDate, 5)}-{dateOnly(s.endDate)}
        </p>
        <p>{RentStatus.rented}</p>
      </div>
    );
  });

  return (
    <div className="list-wrapper">
      <h4>Aktualne wynajęcia:</h4>

      <div className="content">
        {/*<div className="single-address-logo">*/}
        {/*  <i className={`fa fa-file-o`} aria-hidden="true" />*/}
        {/*</div>*/}
        <div className="rent-list">{data}</div>
      </div>
    </div>
  );
};

export default UserRentList;
