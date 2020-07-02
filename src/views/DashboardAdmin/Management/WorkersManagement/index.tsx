import React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import Add from './Add';
import Edit from './Edit';
import List from './List';
import History from './History';

const Workers = () => (
  <section className="users">
    <Switch>
      <Route exact path="/admin/management/workers" render={() => <Redirect to="/admin/management/workers/list" />} />
      <Route path="/admin/management/workers/add" component={Add} />
      <Route path="/admin/management/workers/list" component={List} />
      <Route path="/admin/management/workers/history" component={History} />
      <Route path="/admin/management/workers/edit/:userId" component={Edit} />
    </Switch>
  </section>
);

export default Workers;
