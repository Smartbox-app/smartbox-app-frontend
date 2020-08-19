import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router';
import { UserRes } from 'smartbox-types';
import { Tabs } from '../../../components/Common';
import { Section } from '../../../components/Layout';
import { ApplicationState } from '../../../reducers';
import UserService from '../../../services/user-service';
import { __ } from '../../../helpers/i18n';

import WorkersManagement from './WorkersManagement';
import { BoxMapManagement } from '../../DashboardCommon';
import DiscountCodes from './DiscountCodes';
import StockDiscount from './StockDiscount';
import StockSelect from './StockSelect';

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
          to: `/${UserService.getSlugByRole(user.role)}/management/workers/list`,
          text: `${__('application.workers')}`,
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
          to: `/${UserService.getSlugByRole(user.role)}/management/discount`,
          text: `${__('application.discountsCodes')}`,
        },
        {
          className: 'tab',
          activeClassName: 'active',
          to: `/${UserService.getSlugByRole(user.role)}/management/stock-discount/list`,
          text: `${__('application.generalDiscounts')}`,
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
      <Route path={`/${UserService.getSlugByRole(user.role)}/management/map`} component={BoxMapManagement} />
      <Route path={`/${UserService.getSlugByRole(user.role)}/management/discount`} component={DiscountCodes} />
      <Route path={`/${UserService.getSlugByRole(user.role)}/management/stock-discount`} component={StockDiscount} />
    </Switch>
  </Section>
);

const mapStateToProps = (state: ApplicationState) => ({
  user: state.user.details,
});

export default connect(mapStateToProps)(Management);
