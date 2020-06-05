import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { Main } from '../../components/Layout';
import DashboardContainer from '../../components/Layout/DashboardContainer';
import { MenuItemType } from '../../types/menu-item';
import Navigation from '../../components/Layout/Navigation';

const DashboardWorker = () => {
  const menuItems: MenuItemType[] = [
    {
      icon: 'iconmonstr-user-23.svg',
      text: 'Klienci',
      address: '/worker/customers',
    },
    {
      icon: 'iconmonstr-note-20.svg',
      text: 'Umowy',
      address: '/worker/orders',
    },
  ];

  return (
    <DashboardContainer>
      <Navigation menuItems={menuItems} />
      <Main>
        <Switch>
          <Route exact path="/worker" render={() => <Redirect to="/worker/payment" />} />
          {/* <Route path="/worker/profile" component={Home} />
          <Route path="/worker/payment" component={Home} /> */}
        </Switch>
      </Main>
    </DashboardContainer>
  );
};

export default DashboardWorker;
