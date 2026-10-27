import React from 'react';
import { Switch, Route, Redirect, useParams } from 'react-router';

import { Add } from 'src/views/DashboardAdmin/TTLockManagement/Passcodes/Add';
import { Edit } from 'src/views/DashboardAdmin/TTLockManagement/Passcodes/Edit';
import { List } from 'src/views/DashboardAdmin/TTLockManagement/Passcodes/List';

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
