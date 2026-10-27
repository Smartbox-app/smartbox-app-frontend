import React from 'react';
import { Switch, Route, Redirect, useParams, } from 'react-router';

import { useGetMyDetailsQuery } from 'src/queries';
import UserService from 'src/services/user-service';
import { Add } from './Add';
import { List } from './List';
import { Pricing } from './Pricing';
import { Map } from '../Map';

const Groups = () => {
    const { stockId } = useParams<{ stockId: string}>();
      const { data: user } = useGetMyDetailsQuery();

    if (!user) return null;

    return <Switch>
        <Route exact path={`/${UserService.getSlugByRole(user.role)}/locations/stocks/:stockId/groups`} render={() => <Redirect to={`/${UserService.getSlugByRole(user.role)}/locations/stocks/${stockId}/groups/list`} />} />
        <Route path={`/${UserService.getSlugByRole(user.role)}/locations/stocks/:stockId/groups/add`} component={Add} />
        <Route path={`/${UserService.getSlugByRole(user.role)}/locations/stocks/:stockId/groups/map`} component={Map} />
        <Route path={`/${UserService.getSlugByRole(user.role)}/locations/stocks/:stockId/groups/list`} component={List} />
        <Route path={`/${UserService.getSlugByRole(user.role)}/locations/stocks/:stockId/groups/:groupId/pricing`} component={Pricing} />
    </Switch>
}

export { Groups };
