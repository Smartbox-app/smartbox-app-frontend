import React, { useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { UserRole } from 'smartbox-types';
import { stock, stockGroup } from '../../../actions';
import { rememberRedirect } from '../../../utils/remeber-redirect';
import { ApplicationState } from '../../../reducers';

interface Props {
    getStockList: () => void;
    getStockGroupsList: () => void;
    component: any;
    exact?: boolean;
    path?: string;
}

const RouteWorker = ({ exact, path, component, getStockList, getStockGroupsList }: Props) => {
    const user = useSelector((state: ApplicationState) => state.user.details);
    useEffect(() => {
        getStockList();
        getStockGroupsList();
    }, []);

    if (!user || user.role !== UserRole.worker) {
        return <Route render={() => <Redirect to="/" />} />;
    }
    rememberRedirect(UserRole.worker);
    return <Route exact={exact} path={path} component={component} />;
};


const mapDispatchToProps = (dispatch: any) => bindActionCreators({ ...stock, ...stockGroup }, dispatch);

export default connect(null, mapDispatchToProps)(RouteWorker);
