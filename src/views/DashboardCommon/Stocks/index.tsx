import React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import { Add } from './Add';
import { List } from './List';
import { Manage } from './Manage';
import UserService from '../../../services/user-service';
import { useSelector } from 'react-redux';
import { ApplicationState } from 'src/reducers';
// import Edit from './Edit';

const Stocks = () => {
    const user = useSelector((state: ApplicationState) => state.user.details!);
    return <Switch>
        <Route exact path={`/${UserService.getSlugByRole(user.role)}/stocks`} render={() => <Redirect to={`/${UserService.getSlugByRole(user.role)}/stocks/list`} />} />
        <Route path={`/${UserService.getSlugByRole(user.role)}/stocks/add`} component={Add} />
        <Route path={`/${UserService.getSlugByRole(user.role)}/stocks/list`} component={List} />
        <Route path={`/${UserService.getSlugByRole(user.role)}/stocks/:stockId`} component={Manage} />
    </Switch>
}

export { Stocks };
