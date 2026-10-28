import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

import { Main, DashboardContainer, DashboardSidebar } from 'src/components/Layout';
import { useDashboardSidebarNav } from 'src/hooks/useDashboardSidebarNav';
import { withAttributionSearch } from 'src/utils/attribution-params';

import Management from './Management';
import { TTLockManagement } from './TTLockManagement';
import Profile from '../DashboardCommon/Profile';
import SingleRentDetail from '../DashboardCommon/SingleRentDetail';
import { StockGroups } from '../DashboardCommon/StockGroups';

const DashboardAdmin = () => {
  const sidebarGroups = useDashboardSidebarNav();

  return (
    <DashboardContainer
      sidebar={<DashboardSidebar groups={sidebarGroups} />}
    >
      <Main>
        <Switch>
          <Route
            exact
            path="/admin"
            render={() => (
              <Redirect to={withAttributionSearch('/admin/management/users')} />
            )}
          />
          <Route path="/admin/management/" component={Management} />
          <Route path="/admin/profile" component={Profile} />
          <Route path="/admin/drivers" component={TTLockManagement} />
          <Route path="/admin/locations" component={StockGroups} />
          <Route
            exact
            path="/admin/single-rent/:orderId"
            component={SingleRentDetail}
          />
        </Switch>
      </Main>
    </DashboardContainer>
  );
};

export default DashboardAdmin;
