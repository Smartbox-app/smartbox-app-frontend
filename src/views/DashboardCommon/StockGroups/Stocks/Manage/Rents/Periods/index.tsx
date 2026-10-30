import React from 'react';
import { Switch, Route, Redirect, useParams } from 'react-router';

import { useGetMyDetailsQuery } from 'src/queries';
import UserService from 'src/services/user-service';

import { List } from './List';

const Periods = () => {
  const { stockId, rentId } = useParams<{ stockId: string; rentId: string }>();
  const { data: user } = useGetMyDetailsQuery();

  if (!user) return null;

  return (
    <Switch>
      <Route
        exact
        path={`/${UserService.getSlugByRole(user.role)}/locations/stocks/:stockId/rents/:rentId/periods`}
        render={() => (
          <Redirect
            to={`/${UserService.getSlugByRole(user.role)}/locations/stocks/${stockId}/rents/${rentId}/periods/list`}
          />
        )}
      />
      <Route
        path={`/${UserService.getSlugByRole(user.role)}/locations/stocks/:stockId/rents/:rentId/periods/list`}
        component={List}
      />
    </Switch>
  );
};

export { Periods };
