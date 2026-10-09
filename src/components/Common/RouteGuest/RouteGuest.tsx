import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { UserRole } from 'smartbox-types';
import { AppMessage } from 'src/components/AppMessage';
import { useGetMyDetailsQuery } from 'src/queries';
import { withAttributionSearch } from 'src/utils/attribution-params';

export type RouteGuestProps = {
  component: React.ComponentType;
  exact?: boolean;
  path?: string;
};

export const RouteGuest = ({ component, exact, path }: RouteGuestProps) => {
  const { data: user } = useGetMyDetailsQuery();

  if (user) {
    switch (user!.role) {
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
      <Route exact={exact} path={path} component={component} />
    </>
  );
};
