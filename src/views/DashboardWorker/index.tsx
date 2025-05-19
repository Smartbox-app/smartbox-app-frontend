import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { Main, Section } from '../../components/Layout';
import { DashboardContainer } from '../../components/Layout/DashboardContainer';
import MobileLogoContainer from '../../components/Layout/MobileLogoContainer';
import { MenuItemType } from '../../types/menu-item';
import { Navigation } from '../../components/Layout/Navigation';
import Profile from '../DashboardCommon/Profile';
import ManagementWorker from './ManagementWorker';
import { StockGroups } from '../DashboardCommon/StockGroups';
import { Settings, Stocks } from '../../icons';

const DashboardWorker = () => {
  const menuItems: MenuItemType[] = [
    {
      icon: <Settings />,
      text: 'application.management',
      to: '/worker/management',
    },
    {
      icon: <Stocks />,
      text: 'application.stocks',
      to: '/worker/locations',
    },
    {
      icon: <Settings />,
      text: 'application.account',
      to: '/worker/profile',
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
            path="/worker"
            render={() => <Redirect to="/worker/management" />}
          />
          <Route path="/worker/management/" component={ManagementWorker} />
          <Route path="/worker/profile" component={Profile} />
          <Route path="/worker/locations" component={StockGroups} />
        </Switch>
      </Main>
    </DashboardContainer>
  );
};

export default DashboardWorker;
