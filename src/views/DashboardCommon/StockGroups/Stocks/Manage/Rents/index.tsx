import React from 'react';
import { Switch, Route, Redirect, useParams } from 'react-router';
import { List } from './List';
import { Periods } from './Periods';
import UserService from '../../../../../../services/user-service';
import { useGetMyDetailsQuery } from 'src/queries';

const Rents = () => {
  const { stockId } = useParams<{ stockId: string }>();
  const { data: user } = useGetMyDetailsQuery();

  if (!user) return null;

  const slug = UserService.getSlugByRole(user.role);

  return (
    <Switch>
      <Route
        exact
        path={`/${slug}/locations/stocks/:stockId/rents`}
        render={() => <Redirect to={`/${slug}/locations/stocks/${stockId}/rents/list`} />}
      />
      <Route
        path={`/${slug}/locations/stocks/:stockId/rents/list`}
        component={List}
      />
      <Route
        path={`/${slug}/locations/stocks/:stockId/rents/:rentId/periods`}
        component={Periods}
      />
    </Switch>
  );
};

export { Rents };
