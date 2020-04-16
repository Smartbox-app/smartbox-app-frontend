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

const RouteCustomer = ({ user, exact, path, component }: Props) => (
  // if (!user || user.role !== UserRole.customer) {
  //   return <Route render={() => <Redirect to="/" />} />;
  // }
  // rememberRedirect(UserRole.customer);
  <Route exact={exact} path={path} component={component} />
);
const mapStateToProps = (state: any) => ({
  user: state.user.details,
});

export default connect(mapStateToProps)(RouteCustomer);
