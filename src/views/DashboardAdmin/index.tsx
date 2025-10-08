import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

import { Main, DashboardContainer, Navigation } from '../../components/Layout';
import MobileLogoContainer from '../../components/Layout/MobileLogoContainer';

import { MenuItemType } from '../../types/menu-item';

import Management from './Management';
import Profile from '../DashboardCommon/Profile';
import SingleRentDetail from '../DashboardCommon/SingleRentDetail';
import { StockGroups } from '../DashboardCommon/StockGroups';
import { Groups, HomeWifi, Manage, Settings, Stocks } from '../../icons';
import { useTenantNaming } from 'src/hooks/useTenantNaming';
import { Locks } from './Locks';
import { LockGroups } from './LockGroups';

const DashboardAdmin = () => {
  const {getText} = useTenantNaming();
  
  const menuItems: MenuItemType[] = [
    {
      icon: <Manage />,
      text: 'application.management',
      to: '/admin/management',
    },
    {
      icon: <Stocks />,
      text: getText('many'),
      to: '/admin/locations',
    },
    {
      icon: <Groups />,
      text: 'application.lockGroups',
      to: '/admin/drivers/groups'
    },
    {
      icon: <HomeWifi />,
      text: 'application.locks',
      to: '/admin/drivers/locks'
    },
    {
      icon: <Settings />,
      text: 'application.account',
      to: '/admin/profile',
    },
  ];

  return (
    <DashboardContainer>
      <MobileLogoContainer />
      <Navigation menuItems={menuItems} />
      <Main>
        <Switch>
          <Route
            exact
            path="/admin"
            render={() => <Redirect to="/admin/management" />}
          />
          <Route path="/admin/management/" component={Management} />
          <Route path="/admin/profile" component={Profile} />
          <Route path="/admin/drivers/locks/:groupId?" component={Locks} />
          <Route path="/admin/drivers/groups" component={LockGroups} />
          <Route path={`/admin/locations`} component={StockGroups} />
          <Route
            exact
            path="/admin/single-rent/:orderId"
            component={SingleRentDetail}
          />
        </Switch>
      </Main>
    </DashboardContainer>
  );
};

export default DashboardAdmin;
