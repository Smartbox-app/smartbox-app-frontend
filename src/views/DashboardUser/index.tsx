import React from 'react';

import { Route, Redirect, Switch } from 'react-router-dom';
import { Main } from '../../components/Layout';
import { Welcome, Order, Profile, Contact } from '../DashboardCommon';
import { MenuItemType } from '../../types/menu-item';

import DashboardContainer from '../../components/Layout/DashboardContainer';
import Navigation from '../../components/Layout/Navigation';
import SingleRentDetail from '../DashboardCommon/SingleRentDetail';

const DashboardUser = () => {
  const menuItems: MenuItemType[] = [
    {
      icon: 'dashboard.svg',
      text: 'Home',
      address: '/user/main',
    },
    {
      icon: 'account.svg',
      text: 'Konto',
      address: '/user/profile',
    },
    {
      icon: 'email.svg',
      text: 'Kontakt',
      address: '/user/contact',
    },
  ];

  return (
    <DashboardContainer>
      <Navigation menuItems={menuItems} />
      <Main>
        <Switch>
          <Route exact path="/user" render={() => <Redirect to="/user/main" />} />
          <Route path="/user/main" component={Welcome} />
          <Route path="/user/profile" component={Profile} />
          <Route path="/user/contact" component={Contact} />
          <Route path="/user/order/step/:step" component={Order} />
          <Route exact path="/user/single-rent/:orderId" component={SingleRentDetail} />
        </Switch>
      </Main>
    </DashboardContainer>
  );
};

export default DashboardUser;
