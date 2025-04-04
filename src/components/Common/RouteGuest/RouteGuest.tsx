import { Redirect, Route } from 'react-router-dom';
import { UserRole } from 'smartbox-types';
import { useGetMyDetailsQuery } from 'src/queries';

export type RouteGuestProps = {
  component: any;
  exact?: boolean;
  path?: string;
};

export const RouteGuest = ({ component, exact, path }: RouteGuestProps) => {
  const { data: user } = useGetMyDetailsQuery();

  if (user) {
    switch (user!.role) {
      case UserRole.admin:
        return <Redirect to="/admin" />;
      case UserRole.user:
        return <Redirect to="/user" />;
      case UserRole.worker:
        return <Redirect to="/worker" />;
      case UserRole.client:
        return <Redirect to="/client" />;
      default:
        return null;
    }
  }

  return <Route exact={exact} path={path} component={component} />;
};
