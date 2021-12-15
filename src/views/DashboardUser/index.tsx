import React from 'react';

import { Route, Redirect, Switch } from 'react-router-dom';
import { Main } from '../../components/Layout';
import MobileLogoContainer from '../../components/Layout/MobileLogoContainer';
import { __ } from '../../helpers/i18n';
import { Welcome, Order, Profile, Contact, PayDebtForm } from '../DashboardCommon';
import { MenuItemType } from '../../types/menu-item';

import DashboardContainer from '../../components/Layout/DashboardContainer';
import Navigation from '../../components/Layout/Navigation';
import SingleRentDetail from '../DashboardCommon/SingleRentDetail';

const DashboardUser = () => {
  const menuItems: MenuItemType[] = [
    {
      icon: 'dashboard.svg',
      text: 'application.home',
      address: '/user/main',
    },
    {
      icon: 'account.svg',
      text: 'application.account',
      address: '/user/profile',
    },
    {
      icon: 'email.svg',
      text: 'application.contact',
      address: '/user/contact',
    },
  ];

  return (
    <DashboardContainer>
      <MobileLogoContainer />
      <Navigation menuItems={menuItems} />
      <Main>
        <Switch>
          <Route exact path="/user" render={() => <Redirect to="/user/main" />} />
          <Route path="/user/main" component={Welcome} />
          <Route path="/user/profile" component={Profile} />
          <Route path="/user/contact" component={Contact} />
          <Route path="/user/order/step/:step/:rentId?" component={Order} />
          <Route exact path="/user/single-rent/:orderId" component={SingleRentDetail} />
          <Route exact path="/user/pay-debt/:rentId" component={PayDebtForm} />
        </Switch>
      </Main>
    </DashboardContainer>
  );
};

export default DashboardUser;
