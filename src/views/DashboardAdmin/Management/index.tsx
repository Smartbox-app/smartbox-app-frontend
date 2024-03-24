import React from 'react';
import { connect, useSelector } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router';
import { UserRes } from 'smartbox-types';
import { Tabs } from '../../../components/Branded';
import { Section } from '../../../components/Layout';
import { ApplicationState } from '../../../reducers';
import UserService from '../../../services/user-service';

import WorkersManagement from '../../DashboardCommon/WorkersManagement';
import UsersManagement from '../../DashboardCommon/UsersManagement';

import InvitesSent from '../../DashboardCommon/InvitesSent';
import SMS from '../../DashboardCommon/SMS';
import Settings from './Settings';
import { MapManagement } from './Map';
import { GateManagement } from '../../../views/DashboardCommon/GateManagement';
import ClientsManagement from './ClientsManagement';

const Management = () => {
    const user = useSelector((state: ApplicationState) => state.user.details);

    if (!user) return null;

    return <Section full>
        <Tabs
            tabs={[
                {
                    to: `/${UserService.getSlugByRole(user.role)}/management/users`,
                    text: 'application.users',
                },
                {
                    to: `/${UserService.getSlugByRole(user.role)}/management/workers`,
                    text: 'application.workers',
                },
                {
                    to: `/${UserService.getSlugByRole(user.role)}/management/clients`,
                    text: 'application.tenants',
                },
                {
                    to: `/${UserService.getSlugByRole(user.role)}/management/invitations`,
                    text: 'application.invitations',
                },
                {
                    to: `/${UserService.getSlugByRole(user.role)}/management/map`,
                    text: 'application.boxes',
                },
                {
                    to: `/${UserService.getSlugByRole(user.role)}/management/gate`,
                    text: 'application.gate',
                },
                {
                    to: `/${UserService.getSlugByRole(user.role)}/management/sms`,
                    text: 'application.smsNotifications',
                },
                {
                    to: `/${UserService.getSlugByRole(user.role)}/management/settings`,
                    text: 'application.settings',
                },
            ]}
        />

        <Switch>
            <Route
                exact
                path={`/${UserService.getSlugByRole(user.role)}/management`}
                render={() => <Redirect to={`/${UserService.getSlugByRole(user.role)}/management/workers`} />}
            />
            <Route path={`/${UserService.getSlugByRole(user.role)}/management/workers`} component={WorkersManagement} />
            <Route path={`/${UserService.getSlugByRole(user.role)}/management/users`} component={UsersManagement} />
            <Route path={`/${UserService.getSlugByRole(user.role)}/management/clients`} component={ClientsManagement} />
            <Route path={`/${UserService.getSlugByRole(user.role)}/management/map`} component={MapManagement} />
            <Route path={`/${UserService.getSlugByRole(user.role)}/management/invitations`} component={InvitesSent} />
            <Route path={`/${UserService.getSlugByRole(user.role)}/management/gate`} component={GateManagement} />
            <Route path={`/${UserService.getSlugByRole(user.role)}/management/sms`} component={SMS} />
            <Route path={`/${UserService.getSlugByRole(user.role)}/management/settings`} component={Settings} />
        </Switch>
    </Section>
}

export default Management;
