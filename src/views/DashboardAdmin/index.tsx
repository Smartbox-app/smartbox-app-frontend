import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

import { Main, Footer, DashboardContainer, Navigation } from '../../components/Layout';
import { Welcome, Order } from '../DashboardCommon';

import { MenuItemType } from '../../types/menu-item';
import { __ } from '../../helpers/i18n';

import Management from './Management';

const DashboardAdmin = () => {
  const menuItems: MenuItemType[] = [
    {
      icon: 'dashboard.svg',
      text: __('application.home'),
      address: '/admin/main',
    },
    {
      icon: 'dashboard.svg',
      text: __('application.managment'),
      address: '/admin/management',
    },
    {
      icon: 'account.svg',
      text: __('application.account'),
      address: '/admin/account',
    },
  ];

  return (
    <DashboardContainer>
      <Navigation menuItems={menuItems} />
      <Main>
        <Switch>
          <Route exact path="/admin" render={() => <Redirect to="/admin/main" />} />
          <Route path="/admin/main" component={Welcome} />
          <Route path="/admin/order/:step" component={Order} />
          <Route path="/admin/management" component={Management} />
        </Switch>
      </Main>
      <Footer />
    </DashboardContainer>
  );
};

export default DashboardAdmin;
