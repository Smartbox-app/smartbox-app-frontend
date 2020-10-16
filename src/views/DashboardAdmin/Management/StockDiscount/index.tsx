import React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import Add from './Add';
import Edit from './Edit';
import List from './List';

const Workers = () => (
  <Switch>
    <Route
      exact
      path="/admin/management/stock-discount"
      render={() => <Redirect to="/admin/management/stock-discount/list" />}
    />
    <Route path="/admin/management/stock-discount/add" component={Add} />
    <Route path="/admin/management/stock-discount/list" component={List} />
    <Route path="/admin/management/stock-discount/edit/:userId" component={Edit} />
  </Switch>
);

export default Workers;
