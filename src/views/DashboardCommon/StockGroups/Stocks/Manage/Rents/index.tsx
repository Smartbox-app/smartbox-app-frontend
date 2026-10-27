import React from 'react';
import { Switch, Route, Redirect, useParams } from 'react-router';

import { useGetMyDetailsQuery } from 'src/queries';
import UserService from 'src/services/user-service';
import { List } from 'src/views/DashboardCommon/StockGroups/Stocks/Manage/Rents/List';
import { Periods } from 'src/views/DashboardCommon/StockGroups/Stocks/Manage/Rents/Periods';

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
