import React from 'react';
import { Switch, Route, Redirect } from 'react-router';

import { useGetMyDetailsQuery } from 'src/queries';
import UserService from 'src/services/user-service';
import { Add } from 'src/views/DashboardCommon/CompanyManagement/Add';
import { Edit } from 'src/views/DashboardCommon/CompanyManagement/Edit';
import { List } from 'src/views/DashboardCommon/CompanyManagement/List';

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
