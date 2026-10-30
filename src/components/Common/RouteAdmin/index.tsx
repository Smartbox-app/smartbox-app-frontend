import React from "react";
import { Route, Redirect } from "react-router-dom";

import { UserRole } from "smartbox-types";
import { useGetMyDetailsQuery } from "src/queries";
import { rememberRedirect } from "src/utils/remeber-redirect";

interface Props {
  component: React.ComponentType;
  exact?: boolean;
  path?: string;
}

const RouteAdmin = ({ exact, path, component }: Props) => {
  const { data: user } = useGetMyDetailsQuery();

  if (!user || user.role !== UserRole.admin) {
    return <Route render={() => <Redirect to="/" />} />;
  }
  rememberRedirect(UserRole.admin);
  return <Route exact={exact} path={path} component={component} />;
};

export default RouteAdmin;
