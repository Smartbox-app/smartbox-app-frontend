import React from 'react';
import { Switch, Route, Redirect, useParams, } from 'react-router';
import { Add } from './Add';
import { Edit } from './Edit';
import { List } from './List';
import UserService from '../../../../../../services/user-service';
import { useSelector } from 'react-redux';
import { ApplicationState } from '../../../../../../reducers';
import GateStatus from '../../../../../../views/DashboardCommon/GateStatus';

const Gates = () => {
    const { stockId } = useParams<{ stockId: string }>();
    const user = useSelector((state: ApplicationState) => state.user.details);

    if (!user) return null;

    return <>
        <GateStatus stockId={stockId} />
        <Switch>
            <Route exact path={`/${UserService.getSlugByRole(user.role)}/locations/stocks/:stockId/gates`} render={() => <Redirect to={`/${UserService.getSlugByRole(user.role)}/locations/stocks/${stockId}/gates/list`} />} />
            <Route path={`/${UserService.getSlugByRole(user.role)}/locations/stocks/:stockId/gates/add`} component={Add} />
            <Route path={`/${UserService.getSlugByRole(user.role)}/locations/stocks/:stockId/gates/:gateId/edit`} component={Edit} />
            <Route path={`/${UserService.getSlugByRole(user.role)}/locations/stocks/:stockId/gates/list`} component={List} />
        </Switch>
    </>
}

export { Gates };
