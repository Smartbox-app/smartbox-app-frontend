import React, { useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import { UserRole, UserRes } from 'smartbox-types';
import { bindActionCreators } from 'redux';
import { stock } from '../../../actions';
import { rememberRedirect } from '../../../utils/remeber-redirect';
import { ApplicationState } from '../../../reducers';

interface Props {
    getStockList: () => void;
    component: any;
    exact?: boolean;
    path?: string;
}

const RouteAdmin = ({ exact, path, component, getStockList }: Props) => {
    const user = useSelector((state: ApplicationState) => state.user.details);
    useEffect(() => {
        getStockList();
    }, []);

    if (!user || user.role !== UserRole.client) {
        return <Route render={() => <Redirect to="/" />} />;
    }
    rememberRedirect(UserRole.client);
    return <Route exact={exact} path={path} component={component} />;
};

const mapDispatchToProps = (dispatch: any) => bindActionCreators({ ...stock }, dispatch);

export default connect(null, mapDispatchToProps)(RouteAdmin);
