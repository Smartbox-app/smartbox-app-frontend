import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

import { Main, DashboardContainer, Navigation } from '../../components/Layout';
import MobileLogoContainer from '../../components/Layout/MobileLogoContainer';
import { Invoice } from '../DashboardCommon';

import { MenuItemType } from '../../types/menu-item';

import Management from './Management';
import Profile from '../DashboardCommon/Profile';
import SingleRentDetail from '../DashboardCommon/SingleRentDetail';
import GateStatus from '../DashboardCommon/GateStatus';
import { Stocks } from '../DashboardCommon/Stocks';
import { Gates } from '../DashboardCommon/Gates';

const DashboardAdmin = () => {
  const menuItems: MenuItemType[] = [
    {
      icon: 'settings.svg',
      text: 'application.management',
      address: '/admin/management',
    },
    {
      icon: 'dashboard.svg',
      text: 'application.stocks',
      address: '/admin/stocks',
    },
    {
      icon: 'dashboard.svg',
      text: 'application.gates',
      address: '/admin/gates',
    },
    {
      icon: 'account.svg',
      text: 'application.account',
      address: '/admin/profile',
    },
  ];

  return (
    <DashboardContainer>
      <MobileLogoContainer />
      <Navigation menuItems={menuItems} />
      <GateStatus />
      <Main>
        <Switch>
          <Route exact path="/admin" render={() => <Redirect to="/admin/management" />} />
          <Route path="/admin/management/" component={Management} />
          <Route path="/admin/profile" component={Profile} />
          <Route path="/admin/invoice/" component={Invoice} />
          <Route path={`/admin/stocks`} component={Stocks} />
          <Route path={`/admin/gates`} component={Gates} />
          <Route exact path="/admin/single-rent/:orderId" component={SingleRentDetail} />
        </Switch>
      </Main>
    </DashboardContainer>
  );
};

export default DashboardAdmin;
