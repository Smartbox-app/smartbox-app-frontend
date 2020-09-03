import React from 'react';
import { UserRes, MyRentList } from 'smartbox-types';
import { connect } from 'react-redux';

import { history } from '../../../../../../App';
import { ApplicationState } from '../../../../../../reducers';
import UserService from '../../../../../../services/user-service';

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
      <p className="main-info">{single.size}m2</p>
      <p className="sec-info">{single.stockName}</p>
    </div>
  </div>
);

const mapStateToProps = (state: ApplicationState) => ({
  user: state.user.details,
});

export default connect(mapStateToProps)(SingleStorage);
