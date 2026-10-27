import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

import { Main } from 'src/components/Layout';
import { DashboardContainer } from 'src/components/Layout/DashboardContainer';
import MobileLogoContainer from 'src/components/Layout/MobileLogoContainer';
import { Navigation } from 'src/components/Layout/Navigation';
import { Home, Settings } from 'src/icons';
import { MenuItemType } from 'src/types/menu-item';
import { withAttributionSearch } from 'src/utils/attribution-params';
import { Welcome, Order, Profile, Contact } from 'src/views/DashboardCommon';
import SingleRentDetail from 'src/views/DashboardCommon/SingleRentDetail';

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
