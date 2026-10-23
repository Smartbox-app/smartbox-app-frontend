import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { UserRole } from 'smartbox-types';
import { rememberRedirect } from '../../../utils/remeber-redirect';
import { useGetMyDetailsQuery } from 'src/queries';

interface Props {
    component: React.ComponentType;
    exact?: boolean;
    path?: string;
}

const RouteWorker = ({ exact, path, component }: Props) => {
  const { data: user } = useGetMyDetailsQuery();

    if (!user || user.role !== UserRole.worker) {
        return <Route render={() => <Redirect to="/" />} />;
    }
    rememberRedirect(UserRole.worker);
    return <Route exact={exact} path={path} component={component} />;
};

export default RouteWorker;
