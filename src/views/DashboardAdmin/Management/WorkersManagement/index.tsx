import React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import Add from './Add';
import Edit from './Edit';
import List from './List';

const Workers = () => (
  <section className="users">
    <Switch>
      <Route exact path="/admin/Management/workers" render={() => <Redirect to="/admin/Management/workers/list" />} />
      <Route path="/admin/Management/workers/add" component={Add} />
      <Route path="/admin/Management/workers/list" component={List} />
      <Route path="/admin/Management/workers/edit/:userId" component={Edit} />
    </Switch>
  </section>
);

export default Workers;
