import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { Main } from '../../components/Layout';
import DashboardContainer from '../../components/Layout/DashboardContainer';
// import { Orders, Subcontractor, Products, Profile, Payment, Calendar } from '../DashboardCommon';
// import Users from './workers';
import Home from '../Home';

class DashboardWorker extends React.Component {
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
        address: '/worker/customers',
      },
      {
        icon: '/assets/icons/iconmonstr-note-20.svg',
        text: 'Umowy',
        address: '/worker/orders',
      },
    ];
  };

  render() {
    this.setMenuItems();
    return (
      <DashboardContainer>
        <Main>
          <Switch>
            <Route exact path="/worker" render={() => <Redirect to="/worker/payment" />} />
            <Route path="/worker/profile" component={Home} />
            <Route path="/worker/payment" component={Home} />
          </Switch>
        </Main>
      </DashboardContainer>
    );
  }
}

export default DashboardWorker;
