import React from 'react';
import { Redirect, Route, Switch } from "react-router"
import UserService from "../../../services/user-service"
import { Tabs } from '../../../components/Branded';
import { useSelector } from 'react-redux';
import { ApplicationState } from '../../../reducers';
import { Add } from './Stocks/Add';
import { List } from './Stocks/List';
import { Manage } from './Stocks/Manage';
import { Groups } from './Groups';
import { Section } from '../../../components/Layout';

const StockGroups = () => {
    const user = useSelector((state: ApplicationState) => state.user.details!);
    return <Section full>
        <Tabs
            tabs={[
                {
                    to: `/${UserService.getSlugByRole(user.role)}/stocks/list`,
                    text: 'application.stocks',
                },
                {
                    to: `/${UserService.getSlugByRole(user.role)}/stocks/groups`,
                    text: 'application.stockGroups',
                },
            ]}
        />
        <Switch>
            <Route exact path={`/${UserService.getSlugByRole(user.role)}/stocks`} render={() => <Redirect to={`/${UserService.getSlugByRole(user.role)}/stocks/list`} />} />
            <Route path={`/${UserService.getSlugByRole(user.role)}/stocks/add`} component={Add} />
            <Route path={`/${UserService.getSlugByRole(user.role)}/stocks/list`} component={List} />
            <Route path={`/${UserService.getSlugByRole(user.role)}/stocks/groups`} component={Groups} />
            <Route path={`/${UserService.getSlugByRole(user.role)}/stocks/:stockId`} component={Manage} />
        </Switch>
    </Section>
}

export { StockGroups }