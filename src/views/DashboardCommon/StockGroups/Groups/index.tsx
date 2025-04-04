import React from 'react';
import { Redirect, Route, Switch } from 'react-router';
import UserService from '../../../../services/user-service';
import { Add } from './Add';
import { GroupsList } from './List';
import { useGetMyDetailsQuery } from 'src/queries';

const Groups = () => {
      const { data: user } = useGetMyDetailsQuery();
    return <Switch>
        <Route exact path={`/${UserService.getSlugByRole(user!.role)}/locations/groups`} render={() => <Redirect to={`/${UserService.getSlugByRole(user!.role)}/locations/groups/list`} />} />
        <Route path={`/${UserService.getSlugByRole(user!.role)}/locations/groups/add`} component={Add} />
        <Route path={`/${UserService.getSlugByRole(user!.role)}/locations/groups/list`} component={GroupsList} />
    </Switch>
}

export { Groups }