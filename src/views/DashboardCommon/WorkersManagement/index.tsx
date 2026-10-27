import React from 'react';
import { Switch, Route, Redirect } from 'react-router';

import { useGetMyDetailsQuery } from 'src/queries';
import UserService from 'src/services/user-service';
import Add from 'src/views/DashboardCommon/InviteUser';
import { List } from 'src/views/DashboardCommon/WorkersManagement/List';

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
