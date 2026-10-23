import React from "react";
import { Route, Redirect } from "react-router-dom";
import { UserRole } from "smartbox-types";
import { rememberRedirect } from "../../../utils/remeber-redirect";
import { useGetMyDetailsQuery } from "../../../queries";

interface Props {
  component: React.ComponentType;
  exact?: boolean;
  path?: string;
}

const RouteUser = ({ exact, path, component }: Props) => {
  const { data: user } = useGetMyDetailsQuery();

  if (!user || user.role !== UserRole.user) {
    return <Route render={() => <Redirect to="/" />} />;
  }
  rememberRedirect(UserRole.user);
  return <Route exact={exact} path={path} component={component} />;
};

export default RouteUser;
