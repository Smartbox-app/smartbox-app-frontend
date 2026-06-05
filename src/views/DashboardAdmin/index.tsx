import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

import { Main, DashboardContainer, DashboardSidebar } from '../../components/Layout';
import Management from './Management';
import Profile from '../DashboardCommon/Profile';
import SingleRentDetail from '../DashboardCommon/SingleRentDetail';
import { StockGroups } from '../DashboardCommon/StockGroups';
import { TTLockManagement } from './TTLockManagement';
import { useDashboardSidebarNav } from 'src/hooks/useDashboardSidebarNav';

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
            render={() => <Redirect to="/admin/management/users" />}
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
