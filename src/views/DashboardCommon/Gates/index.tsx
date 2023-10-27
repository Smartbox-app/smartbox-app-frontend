import React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import { Add } from './Add';
import { List } from './List';
import { Edit } from './Edit';

const Gates = () => (
    <Switch>
        <Route exact path="/admin/gates" render={() => <Redirect to="/admin/gates/list" />} />
        <Route path="/admin/gates/add" component={Add} />
        <Route path="/admin/gates/list" component={List} />
        <Route path="/admin/gates/:gateId" component={Edit} />
    </Switch>
);

export { Gates };
