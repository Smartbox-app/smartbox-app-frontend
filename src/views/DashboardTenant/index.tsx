import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

import { Main, DashboardContainer, Navigation } from '../../components/Layout';
import MobileLogoContainer from '../../components/Layout/MobileLogoContainer';
import { MenuItemType } from '../../types/menu-item';
import Management from './Management';
import { Profile } from '../DashboardCommon';
import { Gates } from '../DashboardCommon/Gates';
import GateStatus from '../DashboardCommon/GateStatus';
import { StockGroups } from '../DashboardCommon/StockGroups';

const DashboardTenant = () => {
    const menuItems: MenuItemType[] = [
        {
            icon: 'settings.svg',
            text: 'application.management',
            address: '/client/management',
        },
        {
            icon: 'dashboard.svg',
            text: 'application.stocks',
            address: '/client/stocks',
        },
        {
            icon: 'dashboard.svg',
            text: 'application.gates',
            address: '/client/gates',
        },
        {
            icon: 'account.svg',
            text: 'application.account',
            address: '/client/profile',
        },
    ];

    return (
        <DashboardContainer>
            <MobileLogoContainer />
            <Navigation menuItems={menuItems} />
            <GateStatus />
            <Main>
                <Switch>
                    <Route exact path="/client" render={() => <Redirect to="/client/management" />} />
                    <Route path="/client/management/" component={Management} />
                    <Route path="/client/profile" component={Profile} />
                    <Route path={`/client/stocks`} component={StockGroups} />
                    <Route path={`/client/gates`} component={Gates} />
                </Switch>
            </Main>
        </DashboardContainer>
    );
};

export default DashboardTenant;
