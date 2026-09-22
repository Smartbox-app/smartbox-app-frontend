import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import {
  Main,
  DashboardContainer,
  DashboardSidebar,
} from '../../components/Layout';
import Profile from '../DashboardCommon/Profile';
import ManagementWorker from './ManagementWorker';
import { StockGroups } from '../DashboardCommon/StockGroups';
import { useDashboardSidebarNav } from 'src/hooks/useDashboardSidebarNav';
import { withAttributionSearch } from 'src/utils/attribution-params';

const DashboardWorker = () => {
  const sidebarGroups = useDashboardSidebarNav();

  return (
    <DashboardContainer
      sidebar={<DashboardSidebar groups={sidebarGroups} />}
    >
      <Main>
        <Switch>
          <Route
            exact
            path="/worker"
            render={() => (
              <Redirect
                to={withAttributionSearch('/worker/management/users/list')}
              />
            )}
          />
          <Route path="/worker/management/" component={ManagementWorker} />
          <Route path="/worker/profile" component={Profile} />
          <Route path="/worker/locations" component={StockGroups} />
        </Switch>
      </Main>
    </DashboardContainer>
  );
};

export default DashboardWorker;
