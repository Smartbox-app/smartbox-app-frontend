import React, { useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { UserRole, UserRes } from 'smartbox-types';
import { stock } from '../../../actions';
import { rememberRedirect } from '../../../utils/remeber-redirect';
import { ApplicationState } from '../../../reducers';

interface Props {
  user: UserRes;
  getStockList: () => void;
  component: any;
  exact?: boolean;
  path?: string;
}

const RouteAdmin = ({ user, exact, path, component, getStockList }: Props) => {
  useEffect(() => {
    getStockList();
  }, []);

  if (!user || user.role !== UserRole.admin) {
    return <Route render={() => <Redirect to="/" />} />;
  }
  rememberRedirect(UserRole.admin);
  return <Route exact={exact} path={path} component={component} />;
};

const mapStateToProps = (state: ApplicationState) => ({
  user: state.user.details,
});

const mapDispatchToProps = (dispatch: any) => bindActionCreators({ ...stock }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RouteAdmin);
