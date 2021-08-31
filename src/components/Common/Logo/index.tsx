import React from 'react';
import { connect } from 'react-redux';
import { UserRes } from 'smartbox-types';
import { history } from '../../../App';
import { ApplicationState } from '../../../reducers';
import UserService from '../../../services/user-service';

interface Props {
  user: UserRes;
}

const Logo = ({ user }: Props): any => (
  <img
    src="/assets/images/SmartBox-logo-color.png"
    alt="SmartBox"
    onClick={() => history.push(`/${UserService.getSlugByRole(user.role)}`)}
  />
);

const mapStateToProps = (state: ApplicationState) => ({
  user: state.user.details,
});

export default connect(mapStateToProps)(Logo);
