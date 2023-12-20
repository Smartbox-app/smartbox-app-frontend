import React from 'react';
import { Switch, Route, Redirect, useParams, } from 'react-router';
import { Add } from './Add';
import { List } from './List';
import UserService from '../../../../../../services/user-service';
import { useSelector } from 'react-redux';
import { ApplicationState } from '../../../../../../reducers';
import { Map } from '../Map';

const Boxes = () => {
    const { stockId } = useParams<{ stockId: string}>();
    const user = useSelector((state: ApplicationState) => state.user.details);

    if (!user) return null;

    return <Switch>
        <Route exact path={`/${UserService.getSlugByRole(user.role)}/stocks/:stockId/boxes`} render={() => <Redirect to={`/${UserService.getSlugByRole(user.role)}/stocks/${stockId}/boxes/list`} />} />
        <Route path={`/${UserService.getSlugByRole(user.role)}/stocks/:stockId/boxes/add`} component={Add} />
        <Route path={`/${UserService.getSlugByRole(user.role)}/stocks/:stockId/boxes/map`} component={Map} />
        <Route path={`/${UserService.getSlugByRole(user.role)}/stocks/:stockId/boxes/list`} component={List} />
    </Switch>
}

export { Boxes };
