import React from 'react';
import { RentStatus, ActiveRentsForUserDetails } from 'smartbox-types';
import { Alert } from '../../../../../../../components/Common';
import { dateOnly } from '../../../../../../../utils/format-date';

import './UserRentList.scss';
import {__} from "../../../../../../../helpers/i18n";

interface Props {
  rentList: ActiveRentsForUserDetails[];
}

const UserRentList = ({ rentList }: Props) => {
  if (rentList.length === 0) {
    return <Alert type="notice" text='application.lackOfRent'/>;
  }

  const colorDecider = (s: RentStatus) => {
    switch (s) {
      case RentStatus.noPaidExtension:
        return 'no-paid-extension';
      case RentStatus.noPaidExtensionWithWarning:
        return 'no-paid-extension';
      case RentStatus.toCheck:
        return 'to-check';
      case RentStatus.rented:
        return 'rented';
      default:
        return '';
    }
  };

  const data =
    rentList.length > 0 &&
    rentList.map((s: ActiveRentsForUserDetails) => {
      return (
        <div className="single-rent" key={s.id}>
          <p className={`box-rent ${colorDecider(s.status)}`}>{s.number}</p>
          <p className="dates-rent">
            {dateOnly(s.startAt, 5)}-{dateOnly(s.finishAt)}
          </p>
          <p>{s.status}</p>
        </div>
      );
    });

  return (
    <div className="list-wrapper">
      <h4>{__('application.currentRents')}</h4>

      <div className="content">
        <div className="rent-list">{data}</div>
      </div>
    </div>
  );
};

export default UserRentList;
