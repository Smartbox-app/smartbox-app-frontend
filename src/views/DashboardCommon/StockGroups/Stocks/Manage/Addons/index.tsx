import React from 'react';
import { Switch, Route, Redirect, useParams, } from 'react-router';
import { Add } from './Add';
import { List } from './List';
import UserService from '../../../../../../services/user-service';
import { useSelector } from 'react-redux';
import { ApplicationState } from '../../../../../../reducers';
import { Pricing } from './Pricing';

const Addons = () => {
    const { stockId } = useParams<{ stockId: string }>();
    const user = useSelector((state: ApplicationState) => state.user.details);

    if (!user) return null;

    return <Switch>
        <Route exact path={`/${UserService.getSlugByRole(user.role)}/locations/stocks/:stockId/addons`} render={() => <Redirect to={`/${UserService.getSlugByRole(user.role)}/locations/stocks/${stockId}/addons/list`} />} />
        <Route path={`/${UserService.getSlugByRole(user.role)}/locations/stocks/:stockId/addons/add`} component={Add} />
        <Route path={`/${UserService.getSlugByRole(user.role)}/locations/stocks/:stockId/addons/list`} component={List} />
        <Route path={`/${UserService.getSlugByRole(user.role)}/locations/stocks/:stockId/addons/:addonId/pricing`} component={Pricing} />
    </Switch>
}

export { Addons };
