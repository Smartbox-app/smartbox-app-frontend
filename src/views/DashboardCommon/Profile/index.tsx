import React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import { connect } from 'react-redux';

import { UserRes } from 'smartbox-types';
import { Section } from '../../../components/Layout';
import UserService from '../../../services/user-service';
import { ApplicationState } from '../../../reducers';

import Detail from './Detail';

interface Props {
  user: UserRes;
}

const Profile = ({ user }: Props) => {
  console.log('Profile', UserService.getSlugByRole(user.role));
  return (
    <Section full>
      <Switch>
        <Route
          exact
          path={`/${UserService.getSlugByRole(user.role)}/profile`}
          render={() => <Redirect to={`/${UserService.getSlugByRole(user.role)}/profile/detail`} />}
        />
        <Route path={`/${UserService.getSlugByRole(user.role)}/profile/detail`} component={Detail} />
      </Switch>
    </Section>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  user: state.user.details,
});

export default connect(mapStateToProps)(Profile);
