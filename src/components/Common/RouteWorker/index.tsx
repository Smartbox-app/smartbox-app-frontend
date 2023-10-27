import React, { useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { UserRole } from 'smartbox-types';
import { stock } from '../../../actions';
import { rememberRedirect } from '../../../utils/remeber-redirect';
import { ApplicationState } from '../../../reducers';

interface Props {
    getStockList: () => void;
    component: any;
    exact?: boolean;
    path?: string;
}

const RouteWorker = ({ exact, path, component, getStockList }: Props) => {
    const user = useSelector((state: ApplicationState) => state.user.details);
    useEffect(() => {
        getStockList();
    }, []);

    if (!user || user.role !== UserRole.worker) {
        return <Route render={() => <Redirect to="/" />} />;
    }
    rememberRedirect(UserRole.worker);
    return <Route exact={exact} path={path} component={component} />;
};


const mapDispatchToProps = (dispatch: any) => bindActionCreators({ ...stock }, dispatch);

export default connect(null, mapDispatchToProps)(RouteWorker);
