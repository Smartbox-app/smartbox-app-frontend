import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Switch } from 'react-router';
import UserService from '../../../services/user-service';
import { ApplicationState } from '../../../reducers';

import StockSelect from '../../../views/DashboardAdmin/Management/StockSelect';
import { history } from '../../../App';
import { SingleGate } from './SingleGate';


const GateManagement = () => {
    const user = useSelector((state: ApplicationState) => state.user.details);

    if (!user) return null;

    const handleStockChange = (gateId: string) => {
        history.push(`/${UserService.getSlugByRole(user.role)}/management/gate/${gateId}`)
    }

    return <>
        <StockSelect onChange={handleStockChange} />
        <Switch>
            <Route path={`/${UserService.getSlugByRole(user.role)}/management/gate/:stockId`} component={SingleGate} />
        </Switch>
    </>
}

export { GateManagement }