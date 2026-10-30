import React from 'react';
import { Redirect, Route, Switch } from 'react-router';

import { UserRole } from 'smartbox-types';
import { useGetMyDetailsQuery } from 'src/queries';
import UserService from 'src/services/user-service';

import { Add as AddGroup } from './Groups/Add';
import { GroupsList } from './Groups/List';
import { ManageGroup } from './Groups/Manage';
import { Add } from './Stocks/Add';
import { List } from './Stocks/List';
import { Manage } from './Stocks/Manage';

const StockGroups = () => {
  const { data: user } = useGetMyDetailsQuery();
  const hasFullAccess = [UserRole.admin, UserRole.client].includes(user!.role);

  return (
    <Switch>
        <Route
          exact
          path={`/${UserService.getSlugByRole(user!.role)}/locations`}
          render={() => (
            <Redirect
              to={`/${UserService.getSlugByRole(user!.role)}/locations/stocks`}
            />
          )}
        />
        <Route
          exact
          path={`/${UserService.getSlugByRole(user!.role)}/locations/stocks`}
          render={() => (
            <Redirect
              to={`/${UserService.getSlugByRole(user!.role)}/locations/stocks/list`}
            />
          )}
        />
        <Route
          exact
          path={`/${UserService.getSlugByRole(user!.role)}/locations/groups`}
          render={() => (
            <Redirect
              to={`/${UserService.getSlugByRole(user!.role)}/locations/groups/list`}
            />
          )}
        />
        {hasFullAccess && (
          <Route
            path={`/${UserService.getSlugByRole(user!.role)}/locations/stocks/add`}
            component={Add}
          />
        )}
        <Route
          path={`/${UserService.getSlugByRole(user!.role)}/locations/stocks/list`}
          component={List}
        />
        <Route
          path={`/${UserService.getSlugByRole(user!.role)}/locations/groups/list`}
          component={GroupsList}
        />
        {hasFullAccess && (
          <Route
            path={`/${UserService.getSlugByRole(user!.role)}/locations/groups/add`}
            component={AddGroup}
          />
        )}
        <Route
          path={`/${UserService.getSlugByRole(user!.role)}/locations/groups/:stockGroupId`}
          component={ManageGroup}
        />
        <Route
          path={`/${UserService.getSlugByRole(user!.role)}/locations/stocks/:stockId`}
          component={Manage}
        />
    </Switch>
  );
};

export { StockGroups };
