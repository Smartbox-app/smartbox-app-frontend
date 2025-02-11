import React, { useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import { UserRole } from 'smartbox-types';
import { bindActionCreators } from 'redux';
import { stock, stockGroup } from '../../../actions';
import { rememberRedirect } from '../../../utils/remeber-redirect';
import { ApplicationState } from '../../../reducers';
import { fetchMyData } from '../../../actions/users';

interface Props {
    getStockList: () => void;
    getStockGroupsList: () => void;
    component: any;
    exact?: boolean;
    path?: string;
}

const RouteAdmin = ({  exact, path, component, getStockList, getStockGroupsList }: Props) => {
    const dispatch = useDispatch();
    const user = useSelector((state: ApplicationState) => state.user.details);
    useEffect(() => {
        getStockList();
        getStockGroupsList();
        dispatch(fetchMyData());
    }, []);

    if (!user || user.role !== UserRole.admin) {
        return <Route render={() => <Redirect to="/" />} />;
    }
    rememberRedirect(UserRole.admin);
    return <Route exact={exact} path={path} component={component} />;
};


const mapDispatchToProps = (dispatch: any) => bindActionCreators({ ...stock, ...stockGroup }, dispatch);

export default connect(null, mapDispatchToProps)(RouteAdmin);
