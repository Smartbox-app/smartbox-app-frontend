import React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import UserService from '../../../services/user-service';
import { useGetMyDetailsQuery } from 'src/queries';
import { List } from './List';

export const SystemLogManagement = () => {
  const { data: user } = useGetMyDetailsQuery();

  if (!user) return null;

  return (
    <Switch>
      <Route
        exact
        path={`/${UserService.getSlugByRole(user.role)}/management/system-logs`}
        render={() => (
          <Redirect
            to={`/${UserService.getSlugByRole(user.role)}/management/system-logs/list`}
          />
        )}
      />
      <Route
        path={`/${UserService.getSlugByRole(user.role)}/management/system-logs/list`}
        component={List}
      />
    </Switch>
  );
};

