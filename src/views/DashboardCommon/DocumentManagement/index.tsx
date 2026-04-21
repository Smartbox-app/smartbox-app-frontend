import React from 'react';
import { Switch, Route, Redirect } from 'react-router';

import { List } from './List';
import UserService from '../../../services/user-service';
import { useGetMyDetailsQuery } from 'src/queries';
import { Add } from './Add';
import { Edit } from './Edit';

const DocumentsManagement = () => {
  const { data: user } = useGetMyDetailsQuery();

  if (!user) return null;

  return (
    <Switch>
      <Route
        exact
        path={`/${UserService.getSlugByRole(user.role)}/management/documents`}
        render={() => (
          <Redirect
            to={`/${UserService.getSlugByRole(user.role)}/management/documents/list`}
          />
        )}
      />
      <Route
        path={`/${UserService.getSlugByRole(user.role)}/management/documents/list`}
        component={List}
      />
      <Route
        path={`/${UserService.getSlugByRole(user.role)}/management/documents/add`}
        component={Add}
      />
      <Route
        path={`/${UserService.getSlugByRole(user.role)}/management/documents/:id`}
        component={Edit}
      />
    </Switch>
  );
};

export { DocumentsManagement };
