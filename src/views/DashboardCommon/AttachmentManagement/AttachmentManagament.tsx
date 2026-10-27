import React from 'react';
import { Redirect, Route, Switch } from 'react-router';

import { useGetMyDetailsQuery } from 'src/queries';
import UserService from 'src/services/user-service';
import { Add } from './Add';
import { List } from './List';

const AttachmentManagement = () => {
  const { data: user } = useGetMyDetailsQuery();

  return (
    <Switch>
      <Route
        exact
        path={`/${UserService.getSlugByRole(user!.role)}/management/attachments`}
        render={() => (
          <Redirect
            to={`/${UserService.getSlugByRole(user!.role)}/management/attachments/list`}
          />
        )}
      />

      <Route
        path={`/${UserService.getSlugByRole(user!.role)}/management/attachments/add`}
        component={Add}
      />
      <Route
        path={`/${UserService.getSlugByRole(user!.role)}/management/attachments/list`}
        component={List}
      />

    </Switch>
  );
};

export { AttachmentManagement };
