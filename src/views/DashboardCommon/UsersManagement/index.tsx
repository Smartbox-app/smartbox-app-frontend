import React from 'react';
import { Switch, Route, Redirect } from 'react-router';

import { useGetMyDetailsQuery } from 'src/queries';
import UserService from 'src/services/user-service';
import { AddUser } from '../AddUser';
import Invite from '../InviteUser';
import List from './List';

const UsersManagement = () => {
    const { data: user } = useGetMyDetailsQuery();

  if(!user) return null;

  return <Switch>
    <Route exact path={`/${UserService.getSlugByRole(user.role)}/management/users`}  render={() => <Redirect to={`/${UserService.getSlugByRole(user.role)}/management/users/list`} />} />
    <Route path={`/${UserService.getSlugByRole(user.role)}/management/users/invite`} component={Invite} />
    <Route path={`/${UserService.getSlugByRole(user.role)}/management/users/add`} component={AddUser} />
    <Route path={`/${UserService.getSlugByRole(user.role)}/management/users/list`} component={List} />
  </Switch>
}

export default UsersManagement;
