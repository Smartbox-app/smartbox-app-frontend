import React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import Add from '../Add';
import List from './List';
import History from './History';

const Workers = () => (
  <Switch>
    <Route exact path="/admin/management/workers" render={() => <Redirect to="/admin/management/workers/list" />} />
    <Route path="/admin/management/workers/add" component={Add} />
    <Route path="/admin/management/workers/list" component={List} />
    <Route path="/admin/management/workers/history" component={History} />
  </Switch>
);

export default Workers;
