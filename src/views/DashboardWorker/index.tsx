import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { Main } from '../../components/Layout';
import DashboardContainer from '../../components/Layout/DashboardContainer';
import { MenuItemType } from '../../types/menu-item';
import Navigation from '../../components/Layout/Navigation';
import { BoxMapManagement } from '../DashboardCommon';
import Profile from '../DashboardCommon/Profile';
import { __ } from '../../helpers/i18n';

const DashboardWorker = () => {
  const menuItems: MenuItemType[] = [
    {
      icon: 'dashboard.svg',
      text: __('application.home'),
      address: '/worker/main',
    },
    {
      icon: 'dashboard.svg',
      text: __('application.management'),
      address: '/worker/management',
    },
    {
      icon: 'account.svg',
      text: __('application.account'),
      address: '/worker/profile',
    },
  ];

  return (
    <DashboardContainer>
      <Navigation menuItems={menuItems} />
      <Main>
        <Switch>
          <Route exact path="/worker" render={() => <Redirect to="/worker/management" />} />
          <Route path="/worker/management/" component={BoxMapManagement} />
          <Route path="/worker/profile" component={Profile} />
        </Switch>
      </Main>
    </DashboardContainer>
  );
};

export default DashboardWorker;
