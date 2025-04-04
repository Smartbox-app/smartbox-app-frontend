import React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import { Section } from '../../../components/Layout';
import UserService from '../../../services/user-service';

import Detail from './Detail';
import { useGetMyDetailsQuery } from 'src/queries';

const Profile = () => {
  const { data: user } = useGetMyDetailsQuery();
  return (
    <Section full>
      <Switch>
        <Route
          exact
          path={`/${UserService.getSlugByRole(user!.role)}/profile`}
          render={() => (
            <Redirect
              to={`/${UserService.getSlugByRole(user!.role)}/profile/detail`}
            />
          )}
        />
        <Route
          path={`/${UserService.getSlugByRole(user!.role)}/profile/detail`}
          component={Detail}
        />
      </Switch>
    </Section>
  );
};

export default Profile;
