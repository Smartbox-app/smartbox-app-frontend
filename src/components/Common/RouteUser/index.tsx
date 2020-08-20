import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { UserRole, UserRes } from 'smartbox-types';
import { rememberRedirect } from '../../../utils/remeber-redirect';
import { ApplicationState } from '../../../reducers';

interface Props {
  user: UserRes;
  component: any;
  exact?: boolean;
  path?: string;
}

const RouteUser = ({ user, exact, path, component }: Props) => {
  if (!user || user.role !== UserRole.user) {
    return <Route render={() => <Redirect to="/" />} />;
  }
  rememberRedirect(UserRole.user);
  return <Route exact={exact} path={path} component={component} />;
};

const mapStateToProps = (state: ApplicationState) => ({
  user: state.user.details,
});

export default connect(mapStateToProps)(RouteUser);
