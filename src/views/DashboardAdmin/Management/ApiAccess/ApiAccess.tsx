import React from 'react';
import { Redirect, Route, Switch } from 'react-router';

import { List } from './List';

const ApiAccess = () => (
  <Switch>
    <Route
      exact
      path="/admin/management/api-access"
      render={() => <Redirect to="/admin/management/api-access/list" />}
    />
    <Route path="/admin/management/api-access/list" component={List} />
  </Switch>
);

export default ApiAccess;
