import React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import { AddTenant } from './Add';
import List from './List';
import { AdminTenantSettings } from './TenantSettings';

const ClientsManagement = () => (
  <Switch>
    <Route
      exact
      path="/admin/management/clients"
      render={() => <Redirect to="/admin/management/clients/list" />}
    />
    <Route path="/admin/management/clients/add" component={AddTenant} />
    <Route path="/admin/management/clients/list" component={List} />
    <Route
      path="/admin/management/clients/:userId/:tenantId/settings"
      component={AdminTenantSettings}
    />
  </Switch>
);

export default ClientsManagement;
