import React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import { useSelector } from 'react-redux';
import { Section } from '../../../components/Layout';
import UserService from '../../../services/user-service';
import { ApplicationState } from '../../../reducers';

import Detail from './Detail';

const Profile = () => {
    const user = useSelector((state: ApplicationState) => state.user.details!);
    return (
        <Section full>
            <Switch>
                <Route
                    exact
                    path={`/${UserService.getSlugByRole(user.role)}/profile`}
                    render={() => <Redirect to={`/${UserService.getSlugByRole(user.role)}/profile/detail`} />}
                />
                <Route path={`/${UserService.getSlugByRole(user.role)}/profile/detail`} component={Detail} />
            </Switch>
        </Section>
    );
};

export default Profile;
