import React, { useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import { UserRole, UserRes } from 'smartbox-types';
import { bindActionCreators } from 'redux';
import { stock, user } from '../../../actions';
import { rememberRedirect } from '../../../utils/remeber-redirect';
import { ApplicationState } from 'src/reducers';

interface Props {
    component: any;
    getStockList: () => void;
    fetchMyData: () => void;
    exact?: boolean;
    path?: string;
}

const RouteUser = ({ exact, path, component, getStockList, fetchMyData }: Props) => {
    const user = useSelector((state: ApplicationState) => state.user.details);

    useEffect(() => {
        getStockList();
        fetchMyData();
    }, []);

    if (!user || user.role !== UserRole.user) {
        return <Route render={() => <Redirect to="/" />} />;
    }
    rememberRedirect(UserRole.user);
    return <Route exact={exact} path={path} component={component} />;
};


const mapDispatchToProps = (dispatch: any) => bindActionCreators({ ...stock, ...user }, dispatch);

export default connect(null, mapDispatchToProps)(RouteUser);
