import React from 'react';
import { Switch, Route, Redirect, useParams, } from 'react-router';
import { List } from './List';
import UserService from '../../../../../services/user-service';
import { useSelector } from 'react-redux';
import { ApplicationState } from '../../../../../reducers';

const Discounts = () => {
    const { stockId } = useParams<{ stockId: string }>();
    const user = useSelector((state: ApplicationState) => state.user.details);

    if (!user) return null;

    return <Switch>
        <Route exact path={`/${UserService.getSlugByRole(user.role)}/stocks/:stockId/discounts`} render={() => <Redirect to={`/${UserService.getSlugByRole(user.role)}/stocks/${stockId}/discounts/list`} />} />
        <Route path={`/${UserService.getSlugByRole(user.role)}/stocks/:stockId/discounts/list`} component={List} />
    </Switch>
}

export { Discounts };
