import React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import Invite from '../InviteUser';
import List from './List';
import UserService from '../../../services/user-service';
import { useSelector } from 'react-redux';
import { ApplicationState } from '../../../reducers';
import { AddUser } from '../AddUser';

const UsersManagement = () => {
  const user = useSelector((state: ApplicationState) => state.user.details);

  if(!user) return null;

  return <Switch>
    <Route exact path={`/${UserService.getSlugByRole(user.role)}/management/users`}  render={() => <Redirect to={`/${UserService.getSlugByRole(user.role)}/management/users/list`} />} />
    <Route path={`/${UserService.getSlugByRole(user.role)}/management/users/invite`} component={Invite} />
    <Route path={`/${UserService.getSlugByRole(user.role)}/management/users/add`} component={AddUser} />
    <Route path={`/${UserService.getSlugByRole(user.role)}/management/users/list`} component={List} />
  </Switch>
}

export default UsersManagement;
