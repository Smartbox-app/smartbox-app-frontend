import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router';
import { UserRes } from 'smartbox-types';
import { Tabs } from '../../../components/Common';
import { Section } from '../../../components/Layout';
import { ApplicationState } from '../../../reducers';
import UserService from '../../../services/user-service';
import { __ } from '../../../helpers/i18n';

import { BoxMapManagement } from '../../DashboardCommon';

import WorkersManagement from './WorkersManagement';
import UsersManagement from './UsersManagement';

import StockDiscount from './StockDiscount';
import StockSelect from './StockSelect';
import InvitesSent from './InvitesSent';

interface Props {
  user: UserRes;
}

const Management = ({ user }: Props) => (
  <Section full>
    <StockSelect />
    <Tabs
      tabs={[
        {
          className: 'tab',
          activeClassName: 'active',
          to: `/${UserService.getSlugByRole(user.role)}/management/users/list`,
          text: `${__('application.users')}`,
        },
        {
          className: 'tab',
          activeClassName: 'active',
          to: `/${UserService.getSlugByRole(user.role)}/management/workers/list`,
          text: `${__('application.workers')}`,
        },
        {
          className: 'tab',
          activeClassName: 'active',
          to: `/${UserService.getSlugByRole(user.role)}/management/invitations`,
          text: `${__('application.invitations')}`,
        },
        {
          className: 'tab',
          activeClassName: 'active',
          to: `/${UserService.getSlugByRole(user.role)}/management/map`,
          text: `${__('application.boxes')}`,
        },
        {
          className: 'tab',
          activeClassName: 'active',
          to: `/${UserService.getSlugByRole(user.role)}/management/stock-discount/list`,
          text: `${__('application.stockSale')}`,
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
      <Route path={`/${UserService.getSlugByRole(user.role)}/management/map`} component={BoxMapManagement} />
      <Route path={`/${UserService.getSlugByRole(user.role)}/management/invitations`} component={InvitesSent} />
      <Route path={`/${UserService.getSlugByRole(user.role)}/management/stock-discount`} component={StockDiscount} />
    </Switch>
  </Section>
);

const mapStateToProps = (state: ApplicationState) => ({
  user: state.user.details,
});

export default connect(mapStateToProps)(Management);
