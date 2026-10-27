import React from 'react';
import { Switch, Route, Redirect } from 'react-router';

import { useGetMyDetailsQuery } from 'src/queries';
import UserService from 'src/services/user-service';
import { List } from 'src/views/DashboardCommon/SystemNotificationManagement/List';

const SystemNotificationManagement = () => {
  const { data: user } = useGetMyDetailsQuery();

  if (!user) return null;

  return (
    <Switch>
      <Route
        exact
        path={`/${UserService.getSlugByRole(user.role)}/management/notifications`}
        render={() => (
          <Redirect
            to={`/${UserService.getSlugByRole(user.role)}/management/notifications/list`}
          />
        )}
      />
      <Route
        path={`/${UserService.getSlugByRole(user.role)}/management/notifications/list`}
        component={List}
      />
    </Switch>
  );
};

export default SystemNotificationManagement;
