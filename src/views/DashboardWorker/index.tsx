import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { Main, Section } from '../../components/Layout';
import DashboardContainer from '../../components/Layout/DashboardContainer';
import MobileLogoContainer from '../../components/Layout/MobileLogoContainer';
import { MenuItemType } from '../../types/menu-item';
import Navigation from '../../components/Layout/Navigation';
import { Invoice } from '../DashboardCommon';
import Profile from '../DashboardCommon/Profile';
import ManagementWorker from './ManagementWorker';

const DashboardWorker = () => {
  const menuItems: MenuItemType[] = [
    // {
    //   icon: 'settings.svg',
    //   text: 'application.management',
    //   address: '/worker/management',
    // },
    {
      icon: 'account.svg',
      text: 'application.account',
      address: '/worker/profile',
    },
  ];

  return (
    <DashboardContainer>
      <MobileLogoContainer />
      <Navigation menuItems={menuItems} />
      <Main>
        <Switch>
          <Section full>
            <Route exact path="/worker" render={() => <Redirect to="/worker/management" />} />
            {/* <Route path="/worker/management/" component={ManagementWorker} /> */}
            <Route path="/worker/profile" component={Profile} />
            <Route path="/worker/invoice/" component={Invoice} />
          </Section>
        </Switch>
      </Main>
    </DashboardContainer>
  );
};

export default DashboardWorker;
