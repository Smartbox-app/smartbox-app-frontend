import React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import { PageContent } from '../../../components/Layout';
import Add from './Add';
import Edit from './Edit';
import List from './List';

const Workers = () => (
  <section className="users">
    <PageContent>
      <Switch>
        <Route exact path="/admin/workers" render={() => <Redirect to="/admin/workers/list" />} />
        <Route path="/admin/workers/add" component={Add} />
        <Route path="/admin/workers/list" component={List} />
        <Route path="/admin/workers/edit/:userId" component={Edit} />
      </Switch>
    </PageContent>
  </section>
);

export default Workers;
