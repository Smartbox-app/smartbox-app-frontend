import React from 'react';
import { useSelector } from 'react-redux'; import { Redirect, Route, Switch } from 'react-router';
import UserService from '../../../../services/user-service';
import { ApplicationState } from '../../../../reducers';
import { Add } from './Add';
import { List } from './List';

const Groups = () => {
    const user = useSelector((state: ApplicationState) => state.user.details!);
    return <Switch>
        <Route exact path={`/${UserService.getSlugByRole(user.role)}/locations/groups`} render={() => <Redirect to={`/${UserService.getSlugByRole(user.role)}/locations/groups/list`} />} />
        <Route path={`/${UserService.getSlugByRole(user.role)}/locations/groups/add`} component={Add} />
        <Route path={`/${UserService.getSlugByRole(user.role)}/locations/groups/list`} component={List} />
    </Switch>;
}

export { Groups }