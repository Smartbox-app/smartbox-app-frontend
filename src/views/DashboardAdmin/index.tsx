import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { Main, Footer } from '../../components/Layout';
import DashboardContainer from '../../components/Layout/DashboardContainer';
import { Welcome, Order } from '../DashboardCommon';
import Navigation from '../../components/Layout/Navigation';
import WorkersManagement from './WorkersManagement';
import { MenuItemType } from '../../types/menu-item';
import Management from './Management';

const DashboardAdmin = () => {
  const menuItems: MenuItemType[] = [
    {
      icon: 'dashboard.svg',
      text: 'Home',
      address: '/admin/main',
    },
    {
      icon: 'dashboard.svg',
      text: 'Zarządzanie',
      address: '/admin/management',
    },
    {
      icon: 'account.svg',
      text: 'Konto',
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
