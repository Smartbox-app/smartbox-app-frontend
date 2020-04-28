import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { Main } from '../../components/Layout';
import DashboardContainer from '../../components/Layout/DashboardContainer';
// import { Orders, Subcontractor, Products, Profile, Payment, Calendar } from '../DashboardCommon';
// import Users from './Users';
import Home from '../Home';
import Navigation from '../../components/Layout/Navigation';

class DashboardAdmin extends React.Component {
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
        address: '/admin/main',
      },
      {
        icon: '/assets/icons/dashboard.svg',
        text: 'Pracownicy',
        address: '/admin/workers',
      },
      {
        icon: '/assets/icons/account.svg',
        text: 'Konto',
        address: '/admin/account',
      },
    ];
  };

  render() {
    this.setMenuItems();
    return (
      <DashboardContainer>
        <Main>
          <Navigation menuItems={this.menuItems} />
          <Switch>
            <Route exact path="/admin" render={() => <Redirect to="/admin/main" />} />
            <Route path="/admin/main" component={Home} />
            <Route path="/admin/contact" component={Home} />
            <Route path="/admin/account" component={Home} />
          </Switch>
        </Main>
      </DashboardContainer>
    );
  }
}

export default DashboardAdmin;
