import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { Main } from '../../components/Layout';
import DashboardContainer from '../../components/Layout/DashboardContainer';
// import { Orders, Subcontractor, Products, Profile, Payment, Calendar } from '../DashboardCommon';
// import Users from './Users';
import Home from '../Home';

class DashboardAdmin extends React.Component {
  private menuItems: any[];

  constructor(props: any) {
    super(props);
    this.menuItems = [];
  }

  private setMenuItems = () => {
    this.menuItems = [
      {
        icon: '/assets/icons/iconmonstr-user-23.svg',
        text: 'Klienci',
        address: '/admin/customers',
      },
      {
        icon: '/assets/icons/iconmonstr-note-20.svg',
        text: 'Umowy',
        address: '/admin/orders',
      },
    ];
  };

  render() {
    this.setMenuItems();
    return (
      <DashboardContainer>
        <Main>
          <Switch>
            <Route exact path="/admin" render={() => <Redirect to="/admin/payment" />} />
            <Route path="/admin/profile" component={Home} />
            <Route path="/admin/payment" component={Home} />
            <Route path="/admin/users/:userRole" component={Home} />
          </Switch>
        </Main>
      </DashboardContainer>
    );
  }
}

export default DashboardAdmin;
