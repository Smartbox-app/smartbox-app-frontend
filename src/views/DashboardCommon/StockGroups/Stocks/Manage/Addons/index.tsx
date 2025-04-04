import React from 'react';
import { Switch, Route, Redirect, useParams } from 'react-router';
import { Add } from './Add';
import { List } from './List';
import UserService from '../../../../../../services/user-service';
import { Pricing } from './Pricing';
import { useGetMyDetailsQuery } from 'src/queries';

const Addons = () => {
  const { stockId } = useParams<{ stockId: string }>();
  const { data: user } = useGetMyDetailsQuery();

  if (!user) return null;

  return (
    <Switch>
      <Route
        exact
        path={`/${UserService.getSlugByRole(user.role)}/locations/stocks/:stockId/addons`}
        render={() => (
          <Redirect
            to={`/${UserService.getSlugByRole(user.role)}/locations/stocks/${stockId}/addons/list`}
          />
        )}
      />
      <Route
        path={`/${UserService.getSlugByRole(user.role)}/locations/stocks/:stockId/addons/add`}
        component={Add}
      />
      <Route
        path={`/${UserService.getSlugByRole(user.role)}/locations/stocks/:stockId/addons/list`}
        component={List}
      />
      <Route
        path={`/${UserService.getSlugByRole(user.role)}/locations/stocks/:stockId/addons/:addonId/pricing`}
        component={Pricing}
      />
    </Switch>
  );
};

export { Addons };
