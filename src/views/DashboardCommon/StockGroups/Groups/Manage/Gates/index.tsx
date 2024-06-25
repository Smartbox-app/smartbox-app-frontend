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
    const { stockGroupId } = useParams<{ stockGroupId: string }>();
    const user = useSelector((state: ApplicationState) => state.user.details);

    if (!user) return null;

    return <>
        <GateStatus stockGroupId={stockGroupId} />
        <Switch>
            <Route exact path={`/${UserService.getSlugByRole(user.role)}/locations/groups/:stockGroupId/gates`} render={() => <Redirect to={`/${UserService.getSlugByRole(user.role)}/locations/groups/${stockGroupId}/gates/list`} />} />
            <Route path={`/${UserService.getSlugByRole(user.role)}/locations/groups/:stockGroupId/gates/add`} component={Add} />
            <Route path={`/${UserService.getSlugByRole(user.role)}/locations/groups/:stockGroupId/gates/:gateId/edit`} component={Edit} />
            <Route path={`/${UserService.getSlugByRole(user.role)}/locations/groups/:stockGroupId/gates/list`} component={List} />
        </Switch>
    </>
}

export { Gates };
