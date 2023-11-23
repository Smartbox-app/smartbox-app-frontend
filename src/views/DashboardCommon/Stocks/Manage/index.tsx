import React from 'react';
import {  useSelector } from 'react-redux';
import { PageHeader, ButtonsContainer, Section } from '../../../../components/Layout';
import { Button, Tabs } from '../../../../components/Branded';
import { Route, Switch, useParams } from 'react-router';
import UserService from '../../../../services/user-service';
import { ApplicationState } from '../../../..//reducers';
import { BasicData } from './BasicData';
import { Boxes } from './Boxes';
import { Map } from './Map';
import { Groups } from './Groups';


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
                    // {
                    //     to: `/${UserService.getSlugByRole(user.role)}/stocks/${stockId}/settings`,
                    //     text: 'application.stockSettings',
                    // },
                    {
                        to: `/${UserService.getSlugByRole(user.role)}/stocks/${stockId}/boxes`,
                        text: 'application.stockBoxes',
                    },
                    {
                        to: `/${UserService.getSlugByRole(user.role)}/stocks/${stockId}/groups`,
                        text: 'application.boxesGroups',
                    },
                    {
                        to: `/${UserService.getSlugByRole(user.role)}/stocks/${stockId}/map`,
                        text: 'application.map',
                    },

                ]}
            />

            <Switch>
                <Route exact path={`/${UserService.getSlugByRole(user.role)}/stocks/:stockId`} component={BasicData} />
                <Route path={`/${UserService.getSlugByRole(user.role)}/stocks/:stockId/settings`} component={BasicData} />
                <Route path={`/${UserService.getSlugByRole(user.role)}/stocks/:stockId/boxes`} component={Boxes} />
                <Route path={`/${UserService.getSlugByRole(user.role)}/stocks/:stockId/groups`} component={Groups} />
                <Route path={`/${UserService.getSlugByRole(user.role)}/stocks/:stockId/map`} component={Map} />
            </Switch>

        </Section>
    );
};

export { Manage }
