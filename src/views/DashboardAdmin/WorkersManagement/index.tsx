import React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import Add from './Add';
import Edit from './Edit';
import List from './List';

const Workers = () => (
  <section className="users">
    <Switch>
      <Route exact path="/admin/managment/workers" render={() => <Redirect to="/admin/managment/workers/list" />} />
      <Route path="/admin/managment/workers/add" component={Add} />
      <Route path="/admin/managment/workers/list" component={List} />
      <Route path="/admin/managment/workers/edit/:userId" component={Edit} />
    </Switch>
  </section>
);

export default Workers;
