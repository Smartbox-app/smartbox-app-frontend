import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

import {
  Main,
  DashboardContainer,
  DashboardSidebar,
} from 'src/components/Layout';
import { useDashboardSidebarNav } from 'src/hooks/useDashboardSidebarNav';
import { withAttributionSearch } from 'src/utils/attribution-params';

import { Profile } from '../DashboardCommon';
import { StockGroups } from '../DashboardCommon/StockGroups';
import Management from './Management';
import { TenantStatus } from './TenantStatus';

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
            render={() => (
              <Redirect
                to={withAttributionSearch('/client/management/users/list')}
              />
            )}
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
