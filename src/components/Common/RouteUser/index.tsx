import React, { useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import { UserRole } from 'smartbox-types';
import { bindActionCreators } from 'redux';
import { stock, stockGroup, user } from '../../../actions';
import { rememberRedirect } from '../../../utils/remeber-redirect';
import { ApplicationState } from '../../../reducers';

interface Props {
    component: any;
    getStockList: () => void;
    getStockGroupsList: () => void;
    fetchMyData: () => void;
    exact?: boolean;
    path?: string;
}

const RouteUser = ({ exact, path, component, getStockList, fetchMyData, getStockGroupsList }: Props) => {
    const user = useSelector((state: ApplicationState) => state.user.details);

    useEffect(() => {
        getStockList();
        getStockGroupsList();
        fetchMyData();
    }, []);

    if (!user || user.role !== UserRole.user) {
        return <Route render={() => <Redirect to="/" />} />;
    }
    rememberRedirect(UserRole.user);
    return <Route exact={exact} path={path} component={component} />;
};


const mapDispatchToProps = (dispatch: any) => bindActionCreators({ ...stock, ...stockGroup, ...user }, dispatch);

export default connect(null, mapDispatchToProps)(RouteUser);
