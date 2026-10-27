import React from 'react';
import { Switch, Route, Redirect, useParams } from 'react-router';

import { UserRole } from 'smartbox-types';
import { useGetMyDetailsQuery } from 'src/queries';
import UserService from 'src/services/user-service';
import { Add } from './Add';
import { Edit } from './Edit';
import { List } from './List';

const Gates = () => {
  const { stockId } = useParams<{ stockId: string }>();
  const { data: user } = useGetMyDetailsQuery();

  if (!user) return null;

  const hasFullAccess = [UserRole.admin, UserRole.client].includes(user.role);

  return (
    <>
      <Switch>
        <Route
          exact
          path={`/${UserService.getSlugByRole(user.role)}/locations/stocks/:stockId/gates`}
          render={() => (
            <Redirect
              to={`/${UserService.getSlugByRole(user.role)}/locations/stocks/${stockId}/gates/list`}
            />
          )}
        />
        {hasFullAccess && (
          <Route
            path={`/${UserService.getSlugByRole(user.role)}/locations/stocks/:stockId/gates/add`}
            component={Add}
          />
        )}
        {hasFullAccess && (
          <Route
            path={`/${UserService.getSlugByRole(user.role)}/locations/stocks/:stockId/gates/:gateId/edit`}
            component={Edit}
          />
        )}
        <Route
          path={`/${UserService.getSlugByRole(user.role)}/locations/stocks/:stockId/gates/list`}
          component={List}
        />
      </Switch>
    </>
  );
};

export { Gates };
