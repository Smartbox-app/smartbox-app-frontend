import React from 'react';
import { Switch, Route, Redirect, useParams, } from 'react-router';
import { Add } from './Add';
import { List } from './List';
import UserService from '../../../../../../services/user-service';
import { Map } from '../Map';
import { Pricing } from './Pricing';
import { useGetMyDetailsQuery } from 'src/queries';

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
