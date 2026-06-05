import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

import {
  Main,
  DashboardContainer,
  DashboardSidebar,
} from '../../components/Layout';
import Management from './Management';
import { Profile } from '../DashboardCommon';
import { StockGroups } from '../DashboardCommon/StockGroups';
import { TenantStatus } from './TenantStatus';
import { useDashboardSidebarNav } from 'src/hooks/useDashboardSidebarNav';

const DashboardTenant = () => {
  const sidebarGroups = useDashboardSidebarNav();

  return (
    <DashboardContainer
      sidebar={
        <DashboardSidebar groups={sidebarGroups} bottom={<TenantStatus />} />
      }
    >
      <Main>
        <Switch>
          <Route
            exact
            path="/client"
            render={() => <Redirect to="/client/management/users/list" />}
          />
          <Route path="/client/management/" component={Management} />
          <Route path="/client/profile" component={Profile} />
          <Route path="/client/locations" component={StockGroups} />
        </Switch>
      </Main>
    </DashboardContainer>
  );
};

export default DashboardTenant;
