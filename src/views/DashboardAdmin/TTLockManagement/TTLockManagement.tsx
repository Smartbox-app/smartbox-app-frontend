import React from 'react';
import { Redirect, Route, Switch } from 'react-router';

import { Locks } from './Locks';
import { LockGroups } from './LockGroups';
import { Gateways } from './Gateways';
import { Passcodes } from './Passcodes';

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
