import React from 'react';
import { connect, useSelector } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router';
import { GateManagement } from '../../../views/DashboardCommon/GateManagement';
import { Tabs } from '../../../components/Branded';
import { Section } from '../../../components/Layout';
import { ApplicationState } from '../../../reducers';
import UserService from '../../../services/user-service';
import { MapManagement } from './Map';

const Management = () => {
    const user = useSelector((state: ApplicationState) => state.user.details!);
    return <Section full>
        <Tabs
            tabs={[
                {
                    to: `/${UserService.getSlugByRole(user.role)}/management/map`,
                    text: 'application.boxes',
                },
                {
                    to: `/${UserService.getSlugByRole(user.role)}/management/gate`,
                    text: 'application.gate',
                },
            ]}
        />

        <Switch>
            <Route
                exact
                path={`/${UserService.getSlugByRole(user.role)}/management`}
                render={() => <Redirect to={`/${UserService.getSlugByRole(user.role)}/management/map`} />}
            />
            <Route path={`/${UserService.getSlugByRole(user.role)}/management/map`} component={MapManagement} />
            <Route path={`/${UserService.getSlugByRole(user.role)}/management/gate`} component={GateManagement} />
        </Switch>
    </Section>
}

export default Management;
