import React from 'react';
import { Switch, Route, Redirect, useParams, } from 'react-router';
import { Add } from './Add';
import { List } from './List';
import UserService from '../../../../../services/user-service';
import { useSelector } from 'react-redux';
import { ApplicationState } from '../../../../../reducers';
import { Map } from '../Map';
import { Pricing } from './Pricing';

const Groups = () => {
    const { stockId } = useParams<{ stockId: string}>();
    const user = useSelector((state: ApplicationState) => state.user.details);

    if (!user) return null;

    return <Switch>
        <Route exact path={`/${UserService.getSlugByRole(user.role)}/stocks/:stockId/groups`} render={() => <Redirect to={`/${UserService.getSlugByRole(user.role)}/stocks/${stockId}/groups/list`} />} />
        <Route path={`/${UserService.getSlugByRole(user.role)}/stocks/:stockId/groups/add`} component={Add} />
        <Route path={`/${UserService.getSlugByRole(user.role)}/stocks/:stockId/groups/map`} component={Map} />
        <Route path={`/${UserService.getSlugByRole(user.role)}/stocks/:stockId/groups/list`} component={List} />
        <Route path={`/${UserService.getSlugByRole(user.role)}/stocks/:stockId/groups/:groupId/pricing`} component={Pricing} />
    </Switch>
}

export { Groups };
