import React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import Add from '../Add';
import List from './List';

const UsersManagement = () => (
  <Switch>
    <Route exact path="/admin/management/users" render={() => <Redirect to="/admin/management/users/list" />} />
    <Route path="/admin/management/users/add" component={Add} />
    <Route path="/admin/management/users/list" component={List} />
  </Switch>
);

export default UsersManagement;
