import React from 'react';
import { Switch, Route, Redirect } from 'react-router';

import { List } from './List';
import UserService from '../../../services/user-service';
import { useSelector } from 'react-redux';
import { ApplicationState } from '../../../reducers';
import { Manage } from './Manage';
import { useGetMyDetailsQuery } from 'src/queries';

const TemplatesManagement = () => {
  const { data: user } = useGetMyDetailsQuery();

  if (!user) return null;

  return (
    <Switch>
      <Route
        exact
        path={`/${UserService.getSlugByRole(user.role)}/management/templates`}
        render={() => (
          <Redirect
            to={`/${UserService.getSlugByRole(user.role)}/management/templates/list`}
          />
        )}
      />
      <Route
        path={`/${UserService.getSlugByRole(user.role)}/management/templates/list`}
        component={List}
      />
      <Route
        path={`/${UserService.getSlugByRole(user.role)}/management/templates/manage/:type/:template`}
        component={Manage}
      />
    </Switch>
  );
};

export { TemplatesManagement };
