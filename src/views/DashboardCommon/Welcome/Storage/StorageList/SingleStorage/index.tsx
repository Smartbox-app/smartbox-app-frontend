import React from 'react';
import { UserRes, MyRentList } from 'smartbox-types';
import { connect } from 'react-redux';

import { history } from '../../../../../../App';
import { ApplicationState } from '../../../../../../reducers';
import UserService from '../../../../../../services/user-service';
import { dateOnly } from '../../../../../../utils/format-date';
import { __ } from '../../../../../../helpers/i18n';

import './SingleStorage.scss';

interface Props {
  single: MyRentList;
  user: UserRes;
}

const SingleStorage = ({ single, user }: Props) => (
  <div
    className="single-wrapper"
    onClick={() => history.push(`/${UserService.getSlugByRole(user.role)}/single-rent/${single.id}`)}
  >
    <div className="storage">
      <p className="sec-info">{single.stockName}</p>
      <p className="main-info">
        <strong>
          {__('application.miniStorage')}: {single.number}
        </strong>
      </p>
      <p className="details">
        <span className="date">{dateOnly(single.finishAt)}</span>
        <span className="size">{single.size}m</span>
      </p>
    </div>
  </div>
);

const mapStateToProps = (state: ApplicationState) => ({
  user: state.user.details,
});

export default connect(mapStateToProps)(SingleStorage);
