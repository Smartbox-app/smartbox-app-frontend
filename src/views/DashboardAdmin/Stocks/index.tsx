import React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import { Add } from './Add';
import { List } from './List';
import { Manage } from './Manage';
// import Edit from './Edit';

const Stocks = () => (
    <Switch>
        <Route exact path="/admin/stocks" render={() => <Redirect to="/admin/stocks/list" />} />
        <Route path="/admin/stocks/add" component={Add} />
        <Route path="/admin/stocks/list" component={List} />
        <Route path="/admin/stocks/:stockId" component={Manage} />
    </Switch>
);

export { Stocks };
