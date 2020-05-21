import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { Main } from '../../components/Layout';
import DashboardContainer from '../../components/Layout/DashboardContainer';
// import { Orders, Subcontractor, Products, Profile, Payment, Calendar } from '../DashboardCommon';
// import Users from './Users';
import Home from '../Home';
import { Welcome, Order } from '../DashboardCommon';
import Navigation from '../../components/Layout/Navigation';

class DashboardUser extends React.Component {
  private menuItems: any[];

  constructor(props: any) {
    super(props);
    this.menuItems = [];
  }

  private setMenuItems = () => {
    this.menuItems = [
      {
        icon: '/assets/icons/dashboard.svg',
        text: 'Home',
        address: '/user/main',
      },
      {
        icon: '/assets/icons/account.svg',
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
