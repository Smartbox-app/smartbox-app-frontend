import React from 'react';
import { RentStatus, ActiveRentsForUserDetails, IStock } from 'smartbox-types';
import { Alert } from '../../../components/Common';
import { dateOnly } from '../../../utils/format-date';

import './UserRentList.scss';
import { __ } from '../../../helpers/i18n';
import styled, { css } from 'styled-components';
import { getColorForBackground } from 'src/utils/color';

interface Props {
  rentList: ActiveRentsForUserDetails[];
}

const getColor = (status?: RentStatus) => {
  if (!status || status === RentStatus.free) return '#00a45a';
  if (status === RentStatus.reserved) return '#a51727';
  if (status === RentStatus.rented) return '#a51727';
  if (status === RentStatus.toExplain) return '#000';
  if (status === RentStatus.toCheck) return '#eee';
  if (status === RentStatus.noPaidExtension) return '#fbb03b';
  if (status === RentStatus.noPaidPeriod) return '#fbb03b';
  if (status === RentStatus.noPaidExtensionWithWarning) return '#fbb03b';
  if (status === RentStatus.outOfService) return '#ccc';
  if (status === RentStatus.finished) return '#ccc';
  if (status === RentStatus.failure) return '#a51727';
  return '#000';
};

const StyledStatus = styled.div<{ status?: RentStatus }>`
  border-radius: 2px;
  font-weight: 700;
  font-size: 0.8rem;
  padding: 5px;
  color: #fff;

  ${({ status }) => css`
    background-color: ${getColor(status)};
    color: ${getColorForBackground(getColor(status))};
  `};
`;

const UserRentList = ({ rentList }: Props) => {
  if (rentList.length === 0) {
    return <Alert type="notice" text="application.lackOfRent" />;
  }


  const data =
    rentList.length > 0 &&
    rentList.map((s: ActiveRentsForUserDetails) => {
      return (
        <div className="single-rent" key={s.id}>
          <StyledStatus status={s.status}>{s.number}</StyledStatus>
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
