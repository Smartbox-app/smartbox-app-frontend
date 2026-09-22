import React from 'react';

import { Route, Redirect, Switch } from 'react-router-dom';
import { Main } from '../../components/Layout';
import MobileLogoContainer from '../../components/Layout/MobileLogoContainer';
import { Welcome, Order, Profile, Contact } from '../DashboardCommon';
import { MenuItemType } from '../../types/menu-item';

import { DashboardContainer } from '../../components/Layout/DashboardContainer';
import { Navigation } from '../../components/Layout/Navigation';
import SingleRentDetail from '../DashboardCommon/SingleRentDetail';
import { Home, Settings } from '../../icons';
import { withAttributionSearch } from 'src/utils/attribution-params';

const DashboardUser = () => {
  const menuItems: MenuItemType[] = [
    {
      icon: <Home />,
      text: 'application.home',
      to: '/user/main',
    },
    {
      icon: <Settings />,
      text: 'application.account',
      to: '/user/profile',
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
            path="/user"
            render={() => <Redirect to={withAttributionSearch('/user/main')} />}
          />
          <Route path="/user/main" component={Welcome} />
          <Route path="/user/profile" component={Profile} />
          <Route path="/user/contact" component={Contact} />
          <Route path="/user/order/step/:step/:rentId?" component={Order} />
          <Route
            exact
            path="/user/single-rent/:orderId"
            component={SingleRentDetail}
          />
        </Switch>
      </Main>
    </DashboardContainer>
  );
};

export default DashboardUser;
