import React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import Add from '../InviteUser';
import { List } from './List';
import UserService from '../../../services/user-service';
import { useGetMyDetailsQuery } from 'src/queries';

const Workers = () => {
  const { data: user } = useGetMyDetailsQuery();

  return (
    <Switch>
      <Route
        exact
        path={`/${UserService.getSlugByRole(user!.role)}/management/workers`}
        render={() => (
          <Redirect
            to={`/${UserService.getSlugByRole(user!.role)}/management/workers/list`}
          />
        )}
      />
      <Route
        path={`/${UserService.getSlugByRole(user!.role)}/management/workers/add`}
        component={Add}
      />
      <Route
        path={`/${UserService.getSlugByRole(user!.role)}/management/workers/list`}
        component={List}
      />
      {/* <Route path={`/${UserService.getSlugByRole(user.role)}/management/workers/history`} component={History} /> */}
    </Switch>
  );
};

export default Workers;
