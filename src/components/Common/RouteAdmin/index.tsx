import React, { useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { useDispatch } from "react-redux";
import { UserRole } from "smartbox-types";
import { getStockList } from "../../../actions/stock";
import { getStockGroupsList } from "../../../actions/stock-group";
import { rememberRedirect } from "../../../utils/remeber-redirect";
import { useGetMyDetailsQuery } from "../../../queries";

interface Props {
  component: React.ComponentType;
  exact?: boolean;
  path?: string;
}

const RouteAdmin = ({ exact, path, component }: Props) => {
  const dispatch = useDispatch();
  const { data: user } = useGetMyDetailsQuery();

  useEffect(() => {
    dispatch(getStockList());
    dispatch(getStockGroupsList());
  }, [dispatch]);

  if (!user || user.role !== UserRole.admin) {
    return <Route render={() => <Redirect to="/" />} />;
  }
  rememberRedirect(UserRole.admin);
  return <Route exact={exact} path={path} component={component} />;
};

export default RouteAdmin;
