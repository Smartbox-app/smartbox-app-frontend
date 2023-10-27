import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Switch } from 'react-router';
import { BoxMapManagement } from '../../../../views/DashboardCommon';
import { history } from '../../../../App';
import { ApplicationState } from '../../../../reducers';
import UserService from '../../../../services/user-service';
import StockSelect from '../../../../views/DashboardAdmin/Management/StockSelect';

const MapManagement = () => {
    const user = useSelector((state: ApplicationState) => state.user.details!);
    const handleStockChange = (stockId: string) => {
        history.push(`/${UserService.getSlugByRole(user.role)}/management/map/${stockId}`)
    }

    return <>
        <StockSelect onChange={handleStockChange} />
        <Switch>
            <Route path={`/${UserService.getSlugByRole(user.role)}/management/map/:stockId`} component={BoxMapManagement} />
        </Switch>
    </>
}

export { MapManagement }