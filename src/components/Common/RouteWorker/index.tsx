import React, { useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { UserRole } from 'smartbox-types';
import { getStockList } from '../../../actions/stock';
import { getStockGroupsList } from '../../../actions/stock-group';
import { rememberRedirect } from '../../../utils/remeber-redirect';
import { useGetMyDetailsQuery } from 'src/queries';

interface Props {
    component: React.ComponentType;
    exact?: boolean;
    path?: string;
}

const RouteWorker = ({ exact, path, component }: Props) => {
  const dispatch = useDispatch();
  const { data: user } = useGetMyDetailsQuery();
    useEffect(() => {
        dispatch(getStockList());
        dispatch(getStockGroupsList());
    }, [dispatch]);

    if (!user || user.role !== UserRole.worker) {
        return <Route render={() => <Redirect to="/" />} />;
    }
    rememberRedirect(UserRole.worker);
    return <Route exact={exact} path={path} component={component} />;
};

export default RouteWorker;
