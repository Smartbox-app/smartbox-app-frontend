import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

import { Main, DashboardContainer, Navigation } from '../../components/Layout';
import MobileLogoContainer from '../../components/Layout/MobileLogoContainer';
import { MenuItemType } from '../../types/menu-item';
import Management from './Management';
import { Profile } from '../DashboardCommon';
import { StockGroups } from '../DashboardCommon/StockGroups';
import { TenantStatus } from './TenantStatus';
import { Manage, Settings, Stocks } from '../../icons';

const DashboardTenant = () => {
  const menuItems: MenuItemType[] = [
    {
      icon: <Manage />,
      text: 'application.management',
      to: '/client/management',
    },
    {
      icon: <Stocks />,
      text: 'application.stocks',
      to: '/client/locations',
    },
    {
      icon: <Settings />,
      text: 'application.account',
      to: '/client/profile',
    },
  ];

  return (
    <DashboardContainer>
      <MobileLogoContainer />
      <Navigation menuItems={menuItems} />
      <TenantStatus />
      <Main>
        <Switch>
          <Route
            exact
            path="/client"
            render={() => <Redirect to="/client/management" />}
          />
          <Route path="/client/management/" component={Management} />
          <Route path="/client/profile" component={Profile} />
          <Route path={`/client/locations`} component={StockGroups} />
        </Switch>
      </Main>
    </DashboardContainer>
  );
};

export default DashboardTenant;
