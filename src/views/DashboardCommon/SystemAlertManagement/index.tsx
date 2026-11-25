import React from 'react';
import { Switch, Route, Redirect } from 'react-router';

import { useGetMyDetailsQuery } from 'src/queries';
import UserService from 'src/services/user-service';

import { List } from './List';

const SystemAlertManagement = () => {
  const { data: user } = useGetMyDetailsQuery();

  if (!user) return null;

  return (
    <Switch>
      <Route
        exact
        path={`/${UserService.getSlugByRole(user.role)}/management/system-alerts`}
        render={() => (
          <Redirect
            to={`/${UserService.getSlugByRole(user.role)}/management/system-alerts/list`}
          />
        )}
      />
      <Route
        path={`/${UserService.getSlugByRole(user.role)}/management/system-alerts/list`}
        component={List}
      />
    </Switch>
  );
};

export default SystemAlertManagement;
