import React from 'react';
import { Switch, Route, Redirect } from 'react-router';

import { useGetMyDetailsQuery } from 'src/queries';
import UserService from 'src/services/user-service';
import { Add } from 'src/views/DashboardCommon/DocumentManagement/Add';
import { Edit } from 'src/views/DashboardCommon/DocumentManagement/Edit';
import { List } from 'src/views/DashboardCommon/DocumentManagement/List';

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
