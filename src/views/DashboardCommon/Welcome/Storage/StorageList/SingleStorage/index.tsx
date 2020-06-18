import React from 'react';
import { UserRes } from 'smartbox-types';
import { SingleStorageType } from '../index';

import { history } from '../../../../../../App';
import { ApplicationState } from '../../../../../../reducers';
import UserService from '../../../../../../services/user-service';

import './SingleStorage.scss';
import { connect } from 'react-redux';

interface Props {
  single: SingleStorageType;
  user: UserRes;
}

const SingleStorage = ({ single, user }: Props) => (
  <div
    className="single-wrapper"
    onClick={() => history.push(`/${UserService.getSlugByRole(user.role)}/single-rent/asdasdasda`)}
  >
    <div className="storage">
      <p className="main-info">{single.size}m2</p>
      <p className="sec-info">{single.location}</p>
    </div>
  </div>
);

const mapStateToProps = (state: ApplicationState) => ({
  user: state.user.details,
});

export default connect(mapStateToProps)(SingleStorage);
