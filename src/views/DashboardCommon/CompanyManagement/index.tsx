import React from 'react';
import { Switch, Route, Redirect } from 'react-router';

import { List } from './List';
import { Add } from './Add';
import { Edit } from './Edit';
import UserService from 'src/services/user-service';
import { useGetMyDetailsQuery } from 'src/queries';

const CompaniesManagement = () => {
  const { data: user } = useGetMyDetailsQuery();

  if (!user) return null;

  const slug = UserService.getSlugByRole(user.role);
  const basePath = `/${slug}/management/settlements`;

  return (
    <Switch>
      <Route
        exact
        path={basePath}
        render={() => <Redirect to={`${basePath}/list`} />}
      />
      <Route path={`${basePath}/list`} component={List} />
      <Route path={`${basePath}/add`} component={Add} />
      <Route path={`${basePath}/:id`} component={Edit} />
    </Switch>
  );
};

export { CompaniesManagement };
