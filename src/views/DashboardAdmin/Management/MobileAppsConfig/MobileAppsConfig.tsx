import React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import { Add } from './Add';
import { List } from './List';

const MobileAppsConfig = () => (
  <Switch>
    <Route
      exact
      path="/admin/management/mobile-config"
      render={() => <Redirect to="/admin/management/mobile-config/list" />}
    />
    <Route path="/admin/management/mobile-config/add" component={Add} />
    <Route path="/admin/management/mobile-config/list" component={List} />
  </Switch>
);

export default MobileAppsConfig;
