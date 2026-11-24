import React, { useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';

import { UserRole } from 'smartbox-types';
import { AppMessage } from 'src/components/AppMessage';
import { LanguageSwitcher } from 'src/components/LanguageSwitcher';
import { useGetMyDetailsQuery } from 'src/queries';
import { appendAttributionSearch, withAttributionSearch } from 'src/utils/attribution-params';
import { clearRememberedRedirect, getRememberedRedirect } from 'src/utils/remeber-redirect';

export type RouteGuestProps = {
  component: React.ComponentType;
  exact?: boolean;
  path?: string;
};

export const RouteGuest = ({ component, exact, path }: RouteGuestProps) => {
  const { data: user } = useGetMyDetailsQuery();
  const remembered = user ? getRememberedRedirect() : null;
  const returnTo =
    remembered && remembered.role === user?.role ? remembered.to : null;

  useEffect(() => {
    if (returnTo) clearRememberedRedirect();
  }, [returnTo]);

  if (user) {
    if (returnTo) {
      return <Redirect to={appendAttributionSearch(returnTo)} />;
    }

    switch (user.role) {
      case UserRole.admin:
        return <Redirect to={withAttributionSearch('/admin')} />;
      case UserRole.user:
        return <Redirect to={withAttributionSearch('/user')} />;
      case UserRole.worker:
        return <Redirect to={withAttributionSearch('/worker')} />;
      case UserRole.client:
        return <Redirect to={withAttributionSearch('/client')} />;
      default:
        return null;
    }
  }

  return (
    <>
      <AppMessage />
      <LanguageSwitcher />
      <Route exact={exact} path={path} component={component} />
    </>
  );
};
