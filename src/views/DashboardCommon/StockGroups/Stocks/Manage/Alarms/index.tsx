import React, { useEffect } from 'react';
import { Switch, Route, Redirect, useParams } from 'react-router';
import { List } from './List';
import UserService from '../../../../../../services/user-service';
import { useGetMyDetailsQuery } from 'src/queries';
import { useDispatch } from 'react-redux';
import { refreshApiTableData } from '../../../../../../actions/api-table';

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
