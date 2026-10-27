import React from 'react';
import { Switch, Route, Redirect, useParams } from 'react-router';

import { useGetMyDetailsQuery } from 'src/queries';
import UserService from 'src/services/user-service';
import { List } from './List';

const Payments = () => {
  const { stockId } = useParams<{ stockId: string }>();
  const { data: user } = useGetMyDetailsQuery();

  if (!user) return null;

  return (
    <Switch>
      <Route
        exact
        path={`/${UserService.getSlugByRole(user.role)}/locations/stocks/:stockId/payments`}
        render={() => (
          <Redirect
            to={`/${UserService.getSlugByRole(user.role)}/locations/stocks/${stockId}/payments/list`}
          />
        )}
      />
      <Route
        path={`/${UserService.getSlugByRole(user.role)}/locations/stocks/:stockId/payments/list`}
        component={List}
      />
    </Switch>
  );
};

export { Payments };

