import React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import Add from '../InviteUser';
import List from './List';
import History from './History';
import { useSelector } from 'react-redux';
import { ApplicationState } from '../../../reducers';
import UserService from '../../../services/user-service';

const Workers = () => {
  const user = useSelector((state: ApplicationState) => state.user.details!);

  return <Switch>
    <Route exact path={`/${UserService.getSlugByRole(user.role)}/management/workers`} render={() => <Redirect to="/admin/management/workers/list" />} />
    <Route path={`/${UserService.getSlugByRole(user.role)}/management/workers/add`} component={Add} />
    <Route path={`/${UserService.getSlugByRole(user.role)}/management/workers/list`} component={List} />
    <Route path={`/${UserService.getSlugByRole(user.role)}/management/workers/history`} component={History} />
  </Switch>
}

export default Workers;
