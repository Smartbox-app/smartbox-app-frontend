import React from 'react';
import { connect } from 'react-redux';

import { UserRes } from 'smartbox-types';
import { Button } from '../../../../../components/Common';
import UserService from '../../../../../services/user-service';
import { ApplicationState } from '../../../../../reducers';

import './ButtonForNew.scss';

interface Props {
  user: UserRes;
}

const ButtonForNew = ({ user }: Props) => (
  <div className="new-storage single-wrapper">
    <Button text="Nowy magazyn" outline icon="plus.svg" to={`/${UserService.getSlugByRole(user.role)}/order/step/1`} />
  </div>
);

const mapStateToProps = (state: ApplicationState) => ({
  user: state.user.details,
});

export default connect(mapStateToProps)(ButtonForNew);
