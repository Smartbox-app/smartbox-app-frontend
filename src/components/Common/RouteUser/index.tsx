import React from "react";
import { Route, Redirect } from "react-router-dom";

import { UserRole } from "smartbox-types";
import { useGetMyDetailsQuery } from "src/queries";
import { withAttributionSearch } from "src/utils/attribution-params";
import { rememberRedirect } from "src/utils/remeber-redirect";

interface Props {
  component: React.ComponentType;
  exact?: boolean;
  path?: string;
}

const RouteUser = ({ exact, path, component }: Props) => {
  const { data: user, isPending } = useGetMyDetailsQuery();

  if (isPending) return null;

  if (!user) {
    rememberRedirect(UserRole.user);
    return (
      <Route
        render={() => <Redirect to={withAttributionSearch("/login")} />}
      />
    );
  }

  if (user.role !== UserRole.user) {
    return <Route render={() => <Redirect to="/" />} />;
  }

  return <Route exact={exact} path={path} component={component} />;
};

export default RouteUser;
