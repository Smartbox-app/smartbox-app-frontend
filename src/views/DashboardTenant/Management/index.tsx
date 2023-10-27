import React from 'react';
import { useSelector } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router';
import { Tabs } from '../../../components/Branded';
import { Section } from '../../../components/Layout';
import { ApplicationState } from '../../../reducers';
import UserService from '../../../services/user-service';

import UsersManagement from '../../DashboardCommon/UsersManagement';
import { Settings } from '../Settings';
import InvitesSent from '../../DashboardCommon/InvitesSent';

const Management = () => {
    const user = useSelector((state: ApplicationState) => state.user.details!);
    return <Section full>
        <Tabs
            tabs={[
                {
                    to: `/${UserService.getSlugByRole(user.role)}/management/users/list`,
                    text: 'application.users',
                },
                {
                    to: `/${UserService.getSlugByRole(user.role)}/management/invitations`,
                    text: 'application.invitations',
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
                render={() => <Redirect to={`/${UserService.getSlugByRole(user.role)}/management/users`} />}
            />
            <Route path={`/${UserService.getSlugByRole(user.role)}/management/users`} component={UsersManagement} />
            <Route path={`/${UserService.getSlugByRole(user.role)}/management/settings`} component={Settings} />
            <Route path={`/${UserService.getSlugByRole(user.role)}/management/invitations`} component={InvitesSent} />
        </Switch>
    </Section>
}

export default Management;
