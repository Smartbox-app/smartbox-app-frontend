import React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import { AddTenant } from './Add';
import List from './List';

const ClientsManagement = () => (
    <Switch>
        <Route exact path="/admin/management/clients" render={() => <Redirect to="/admin/management/clients/list" />} />
        <Route path="/admin/management/clients/add" component={AddTenant} />
        <Route path="/admin/management/clients/list" component={List} />
    </Switch>
);

export default ClientsManagement;
