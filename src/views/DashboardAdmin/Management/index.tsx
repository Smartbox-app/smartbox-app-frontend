import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router';
import { UserRes } from 'smartbox-types';
import { Tabs } from '../../../components/Common';
import { Section } from '../../../components/Layout';
import { ApplicationState } from '../../../reducers';
import UserService from '../../../services/user-service';

import { BoxMapManagement } from '../../DashboardCommon';
import Gate from '../../DashboardCommon/SingleRentDetail/Gate';

import WorkersManagement from './WorkersManagement';
import UsersManagement from './UsersManagement';

import StockDiscount from './StockDiscount';
import InvitesSent from './InvitesSent';
import SMS from './SMS';
import Settings from './Settings';
import { Stocks } from '../Stocks';
import { MapManagement } from './Map';

interface Props {
  user: UserRes;
}

const Management = ({ user }: Props) => (
  <Section full>
    <Tabs
      tabs={[
        {
          className: 'tab',
          activeClassName: 'active',
          to: `/${UserService.getSlugByRole(user.role)}/management/users/list`,
          text: 'application.users',
        },
        {
          className: 'tab',
          activeClassName: 'active',
          to: `/${UserService.getSlugByRole(user.role)}/management/workers/list`,
          text: 'application.workers',
        },
        {
          className: 'tab',
          activeClassName: 'active',
          to: `/${UserService.getSlugByRole(user.role)}/management/invitations`,
          text: 'application.invitations',
        },
        {
          className: 'tab',
          activeClassName: 'active',
          to: `/${UserService.getSlugByRole(user.role)}/management/map`,
          text: 'application.boxes',
        },
        {
          className: 'tab',
          activeClassName: 'active',
          to: `/${UserService.getSlugByRole(user.role)}/management/stock-discount/list`,
          text: 'application.stockSale',
        },
        {
          className: 'tab',
          activeClassName: 'active',
          to: `/${UserService.getSlugByRole(user.role)}/management/gate`,
          text: 'application.gate',
        },
        {
          className: 'tab',
          activeClassName: 'active',
          to: `/${UserService.getSlugByRole(user.role)}/management/sms`,
          text: 'application.smsNotifications',
        },
        {
          className: 'tab',
          activeClassName: 'active',
          to: `/${UserService.getSlugByRole(user.role)}/management/settings`,
          text: 'application.settings',
        },
      ]}
    />

    <Switch>
      <Route
        exact
        path={`/${UserService.getSlugByRole(user.role)}/management`}
        render={() => <Redirect to={`/${UserService.getSlugByRole(user.role)}/management/workers`} />}
      />
      <Route path={`/${UserService.getSlugByRole(user.role)}/management/workers`} component={WorkersManagement} />
      <Route path={`/${UserService.getSlugByRole(user.role)}/management/users`} component={UsersManagement} />
      <Route path={`/${UserService.getSlugByRole(user.role)}/management/map`} component={MapManagement} />
      <Route path={`/${UserService.getSlugByRole(user.role)}/management/invitations`} component={InvitesSent} />
      <Route path={`/${UserService.getSlugByRole(user.role)}/management/stock-discount`} component={StockDiscount} />
      <Route path={`/${UserService.getSlugByRole(user.role)}/management/gate`} component={Gate} />
      <Route path={`/${UserService.getSlugByRole(user.role)}/management/sms`} component={SMS} />
      <Route path={`/${UserService.getSlugByRole(user.role)}/management/settings`} component={Settings} />
    </Switch>
  </Section>
);

const mapStateToProps = (state: ApplicationState) => ({
  user: state.user.details,
});

export default connect(mapStateToProps)(Management);
