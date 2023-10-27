import React from 'react';
import {  useSelector } from 'react-redux';
import { PageHeader, ButtonsContainer, Section } from '../../../../components/Layout';
import { Button, Tabs } from '../../../../components/Branded';
import { Route, Switch, useParams } from 'react-router';
import UserService from '../../../../services/user-service';
import { ApplicationState } from 'src/reducers';
import { BasicData } from './BasicData';


const Manage = () => {
    const { stockId } = useParams<{ stockId: string }>();
    const user = useSelector((state: ApplicationState) => state.user.details);

    if(!user) return null;

    return (
        <Section>
            <PageHeader title="application.stockManage" />
            <ButtonsContainer>
                <Button to="/admin/stocks" text="application.back" primary />
            </ButtonsContainer>

            <Tabs
                tabs={[
                    {
                        to: `/${UserService.getSlugByRole(user.role)}/stocks/${stockId}`,
                        text: 'application.stockBasicData',
                    },
                    {
                        to: `/${UserService.getSlugByRole(user.role)}/stocks/${stockId}/settings`,
                        text: 'application.stockSettings',
                    },
                    {
                        to: `/${UserService.getSlugByRole(user.role)}/stocks/${stockId}/boxes`,
                        text: 'application.stockBoxes',
                    },

                ]}
            />

            <Switch>
                <Route path={`/${UserService.getSlugByRole(user.role)}/stocks/:stockId`} component={BasicData} />
                <Route path={`/${UserService.getSlugByRole(user.role)}/stocks/:stockId/settings`} component={BasicData} />
                <Route path={`/${UserService.getSlugByRole(user.role)}/stocks/:stockId/boxes`} component={BasicData} />
            </Switch>

        </Section>
    );
};

export { Manage }
