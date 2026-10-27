import React from 'react';
import { Redirect, Route, Switch } from 'react-router';

import { Gateways } from 'src/views/DashboardAdmin/TTLockManagement/Gateways';
import { LockGroups } from 'src/views/DashboardAdmin/TTLockManagement/LockGroups';
import { Locks } from 'src/views/DashboardAdmin/TTLockManagement/Locks';
import { Passcodes } from 'src/views/DashboardAdmin/TTLockManagement/Passcodes';

export const TTLockManagement = () => {
  return (
    <Switch>
      <Route
        exact
        path="/admin/drivers"
        render={() => <Redirect to="/admin/drivers/gateways" />}
      />
      <Route path="/admin/drivers/gateways" component={Gateways} />
      <Route path="/admin/drivers/groups" component={LockGroups} />
      <Route
        path="/admin/drivers/locks/:lockId/passcodes"
        component={Passcodes}
      />
      <Route
        path="/admin/drivers/locks/:type?/:groupOrGatewayId?"
        component={Locks}
      />
    </Switch>
  );
};
