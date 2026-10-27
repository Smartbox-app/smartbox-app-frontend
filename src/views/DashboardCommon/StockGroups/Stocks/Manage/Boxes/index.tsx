import React from 'react';
import { Switch, Route, Redirect, useParams } from 'react-router';

import { UserRole } from 'smartbox-types';
import { useGetMyDetailsQuery } from 'src/queries';
import UserService from 'src/services/user-service';
import { Add } from 'src/views/DashboardCommon/StockGroups/Stocks/Manage/Boxes/Add';
import { AddBatch } from 'src/views/DashboardCommon/StockGroups/Stocks/Manage/Boxes/AddBatch';
import { List } from 'src/views/DashboardCommon/StockGroups/Stocks/Manage/Boxes/List';
import { Map } from 'src/views/DashboardCommon/StockGroups/Stocks/Manage/Map';

const Boxes = () => {
  const { stockId } = useParams<{ stockId: string }>();
  const { data: user } = useGetMyDetailsQuery();

  if (!user) return null;

  const hasFullAccess = [UserRole.admin, UserRole.client].includes(user!.role);

  return (
    <Switch>
      <Route
        exact
        path={`/${UserService.getSlugByRole(user.role)}/locations/stocks/:stockId/boxes`}
        render={() => (
          <Redirect
            to={`/${UserService.getSlugByRole(user.role)}/locations/stocks/${stockId}/boxes/list`}
          />
        )}
      />
      {hasFullAccess && (
        <Route
          path={`/${UserService.getSlugByRole(user.role)}/locations/stocks/:stockId/boxes/add`}
          component={Add}
        />
      )}
      {hasFullAccess && (
        <Route
          path={`/${UserService.getSlugByRole(user.role)}/locations/stocks/:stockId/boxes/add-multiple`}
          component={AddBatch}
        />
      )}
      {hasFullAccess && (
        <Route
          path={`/${UserService.getSlugByRole(user.role)}/locations/stocks/:stockId/boxes/map`}
          component={Map}
        />
      )}
      <Route
        path={`/${UserService.getSlugByRole(user.role)}/locations/stocks/:stockId/boxes/list`}
        component={List}
      />
    </Switch>
  );
};

export { Boxes };
