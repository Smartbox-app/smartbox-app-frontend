import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { Main, Footer } from '../../components/Layout';
import DashboardContainer from '../../components/Layout/DashboardContainer';
import { Welcome, Order } from '../DashboardCommon';
import Home from '../Home';
import Navigation from '../../components/Layout/Navigation';
import WorkersManagement from './WorkersManagement';
import Managment from './Managment';

class DashboardAdmin extends React.Component {
  private menuItems: any[];

  constructor(props: any) {
    super(props);
    this.menuItems = [];
  }

  private setMenuItems = () => {
    this.menuItems = [
      {
        icon: 'dashboard.svg',
        text: 'Home',
        address: '/admin/main',
      },
      {
        icon: 'dashboard.svg',
        text: 'Zarządzanie',
        address: '/admin/managment',
      },
      {
        icon: 'account.svg',
        text: 'Konto',
        address: '/admin/account',
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
            <Route exact path="/admin" render={() => <Redirect to="/admin/main" />} />
            <Route path="/admin/main" component={Welcome} />
            <Route path="/admin/order/:step" component={Order} />
            <Route path="/admin/account" component={Home} />
            <Route path="/admin/managment" component={Managment} />
          </Switch>
        </Main>
        <Footer />
      </DashboardContainer>
    );
  }
}

export default DashboardAdmin;
