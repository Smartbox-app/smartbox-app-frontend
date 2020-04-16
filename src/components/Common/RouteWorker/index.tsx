import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { UserRole, UserEntity } from 'smartbox-types';
import { rememberRedirect } from '../../../utils/remeber-redirect';

interface Props {
  user: UserEntity;
  component: any;
  exact?: boolean;
  path?: string;
}

const RouteWorker = ({ user, exact, path, component }: Props) => {
  if (!user || user.role !== UserRole.worker) {
    return <Route render={() => <Redirect to="/" />} />;
  }
  rememberRedirect(UserRole.worker);
  return <Route exact={exact} path={path} component={component} />;
};

const mapStateToProps = (state: any) => ({
  user: state.user.details,
});

export default connect(mapStateToProps)(RouteWorker);
