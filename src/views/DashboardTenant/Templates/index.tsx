import React from 'react';
import { Switch, Route, Redirect } from 'react-router';

import { List } from './List';
import UserService from '../../../services/user-service';
import { Manage } from './Manage';
import { useGetMyDetailsQuery } from 'src/queries';

type TemplatesManagementProps = {
  basePath?: string;
  tenantId?: string;
};

const TemplatesManagement = ({
  basePath: basePathOverride,
  tenantId,
}: TemplatesManagementProps) => {
  const { data: user } = useGetMyDetailsQuery();

  if (!user) return null;

  const basePath =
    basePathOverride ??
    `/${UserService.getSlugByRole(user.role)}/management/templates`;

  return (
    <Switch>
      <Route
        exact
        path={basePath}
        render={() => <Redirect to={`${basePath}/list`} />}
      />
      <Route
        path={`${basePath}/list`}
        render={() => <List basePath={basePath} tenantId={tenantId} />}
      />
      <Route
        path={`${basePath}/manage/:type/:template`}
        render={() => <Manage basePath={basePath} tenantId={tenantId} />}
      />
    </Switch>
  );
};

export { TemplatesManagement };
