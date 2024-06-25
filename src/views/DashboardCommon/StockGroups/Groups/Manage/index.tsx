import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { PageHeader, ButtonsContainer, Section } from '../../../../../components/Layout';
import { Button, Tabs } from '../../../../../components/Branded';
import { Redirect, Route, Switch, useParams } from 'react-router';
import UserService from '../../../../../services/user-service';
import { ApplicationState } from '../../../../../reducers';
import { BasicData } from './BasicData';
import { Gates } from './Gates';

const ManageGroup = () => {
    const { stockGroupId } = useParams<{ stockGroupId: string }>();
    const user = useSelector((state: ApplicationState) => state.user.details);


    const tabs = useMemo(() => {
        const elements = [
            {
                to: `/${UserService.getSlugByRole(user!.role)}/locations/groups/${stockGroupId}/data`,
                text: 'application.stockGroupBasicData',
            },
            {
                to: `/${UserService.getSlugByRole(user!.role)}/locations/groups/${stockGroupId}/gates`,
                text: 'application.gates',
            },
        ]

            return elements;
    }, [])

    return (
        <Section>
            <PageHeader title="application.stockManage" />
            <ButtonsContainer>
                <Button to="/admin/locations/groups" text="application.back" primary />
            </ButtonsContainer>

            <Tabs
                tabs={tabs}
            />

            <Switch>
                <Route exact path={`/${UserService.getSlugByRole(user!.role)}/locations/groups/:stockGroupId`} render={() => <Redirect to={`/${UserService.getSlugByRole(user!.role)}/locations/groups/${stockGroupId}/data`} />} />
                <Route exact path={`/${UserService.getSlugByRole(user!.role)}/locations/groups/:stockGroupId/data`} component={BasicData} />
                <Route path={`/${UserService.getSlugByRole(user!.role)}/locations/groups/:stockGroupId/gates`} component={Gates} />
            </Switch>

        </Section>
    );
};

export { ManageGroup }
