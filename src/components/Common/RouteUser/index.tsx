import React, { useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { UserRole } from "smartbox-types";
import { bindActionCreators } from "redux";
import { stock, stockGroup } from "../../../actions";
import { rememberRedirect } from "../../../utils/remeber-redirect";
import { useGetMyDetailsQuery } from "../../../queries";

interface Props {
  component: any;
  getStockList: () => void;
  getStockGroupsList: () => void;
  exact?: boolean;
  path?: string;
}

const RouteUser = ({
  exact,
  path,
  component,
  getStockList,
  getStockGroupsList,
}: Props) => {
  const { data: user } = useGetMyDetailsQuery();
  useEffect(() => {
    getStockList();
    getStockGroupsList();
  }, []);

  if (!user || user.role !== UserRole.user) {
    return <Route render={() => <Redirect to="/" />} />;
  }
  rememberRedirect(UserRole.user);
  return <Route exact={exact} path={path} component={component} />;
};

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators({ ...stock, ...stockGroup }, dispatch);

export default connect(null, mapDispatchToProps)(RouteUser);
