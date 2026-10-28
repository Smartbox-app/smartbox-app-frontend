import React from 'react';
import { Switch, Route, Redirect } from 'react-router';

import { useGetMyDetailsQuery } from 'src/queries';
import UserService from 'src/services/user-service';

import { List } from './List';
import { Manage } from './Manage';

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
        path={`${basePath}/manage/:type/:template/stock/:id?`}
        render={() => (
          <Manage forStock basePath={basePath} tenantId={tenantId} />
        )}
      />
      <Route
        path={`${basePath}/manage/:type/:template`}
        render={() => <Manage basePath={basePath} tenantId={tenantId} />}
      />
    </Switch>
  );
};

export { TemplatesManagement };
