import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Switch, Route, Redirect, useParams } from 'react-router';

import { refreshApiTableData } from 'src/actions/api-table';
import { useGetMyDetailsQuery } from 'src/queries';
import UserService from 'src/services/user-service';

import { List } from './List';

const Alarms = () => {
  const { stockId } = useParams<{ stockId: string }>();
  const { data: user } = useGetMyDetailsQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(refreshApiTableData());
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  });

  if (!user) return null;

  return (
    <>
      <Switch>
        <Route
          exact
          path={`/${UserService.getSlugByRole(user.role)}/locations/stocks/:stockId/alarms`}
          render={() => (
            <Redirect
              to={`/${UserService.getSlugByRole(user.role)}/locations/stocks/${stockId}/alarms/list`}
            />
          )}
        />

        <Route
          path={`/${UserService.getSlugByRole(user.role)}/locations/stocks/:stockId/alarms/list`}
          component={List}
        />
      </Switch>
    </>
  );
};

export { Alarms };
