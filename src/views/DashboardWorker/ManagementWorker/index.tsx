import React from 'react';
import { connect, useSelector } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router';
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
            ]}
        />

        <Switch>
            <Route
                exact
                path={`/${UserService.getSlugByRole(user.role)}/management`}
                render={() => <Redirect to={`/${UserService.getSlugByRole(user.role)}/management/map`} />}
            />
            <Route path={`/${UserService.getSlugByRole(user.role)}/management/map`} component={MapManagement} />
        </Switch>
    </Section>
}

export default Management;
