import React from 'react';
import { Switch, Route, Redirect, useParams, } from 'react-router';
import { List } from './List';
import UserService from '../../../../../../services/user-service';
import { useGetMyDetailsQuery } from 'src/queries';

const Discounts = () => {
    const { stockId } = useParams<{ stockId: string }>();
      const { data: user } = useGetMyDetailsQuery();

    if (!user) return null;

    return <Switch>
        <Route exact path={`/${UserService.getSlugByRole(user.role)}/locations/stocks/:stockId/discounts`} render={() => <Redirect to={`/${UserService.getSlugByRole(user.role)}/locations/stocks/${stockId}/discounts/list`} />} />
        <Route path={`/${UserService.getSlugByRole(user.role)}/locations/stocks/:stockId/discounts/list`} component={List} />
    </Switch>
}

export { Discounts };
