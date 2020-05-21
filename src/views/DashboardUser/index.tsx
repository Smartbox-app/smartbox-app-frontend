import React from 'react';

import { Route, Redirect, Switch } from 'react-router-dom';
import { Main } from '../../components/Layout';
import { Welcome, Order } from '../DashboardCommon';
import { MenuItemType } from '../../types/menu-item';

import DashboardContainer from '../../components/Layout/DashboardContainer';
import Navigation from '../../components/Layout/Navigation';

class DashboardUser extends React.Component {
  private menuItems: MenuItemType[];

  constructor(props: {}) {
    super(props);
    this.menuItems = [];
  }

  private setMenuItems = () => {
    this.menuItems = [
      {
        icon: 'dashboard.svg',
        text: 'Home',
        address: '/user/main',
      },
      {
        icon: 'account.svg',
        text: 'Konto',
        address: '/user/main',
      },
    ];
  };

  render() {
    this.setMenuItems();
    return (
      <DashboardContainer>
        <Navigation menuItems={this.menuItems} />
        <Main>
          <Switch>
            <Route exact path="/user" render={() => <Redirect to="/user/main" />} />
            <Route path="/user/main" component={Welcome} />
            <Route path="/user/order/:step" component={Order} />
          </Switch>
        </Main>
      </DashboardContainer>
    );
  }
}

export default DashboardUser;
