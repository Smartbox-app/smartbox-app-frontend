import React from 'react';
import { Switch, Route, Redirect, useParams } from 'react-router';

import { Add } from './Add';
import { Edit } from './Edit';
import { List } from './List';

export const Passcodes = () => {
  const { lockId } = useParams<{ lockId: string }>();
  return (
    <Switch>
      <Route
        exact
        path="/admin/drivers/locks/:lockId/passcodes"
        render={() => (
          <Redirect to={`/admin/drivers/locks/${lockId}/passcodes/list`} />
        )}
      />
      <Route
        path="/admin/drivers/locks/:lockId/passcodes/add"
        component={Add}
      />
      <Route
        path="/admin/drivers/locks/:lockId/passcodes/:passcodeId/edit"
        component={Edit}
      />
      <Route
        path="/admin/drivers/locks/:lockId/passcodes/list"
        component={List}
      />
    </Switch>
  );
};
