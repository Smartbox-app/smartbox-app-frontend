import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router';
import { UserRes } from 'smartbox-types';
import { Tabs } from '../../../components/Common';
import { Section } from '../../../components/Layout';
import { ApplicationState } from '../../../reducers';
import UserService from '../../../services/user-service';
import { BoxMapManagement } from '../../DashboardCommon';
import StockSelect from '../../DashboardAdmin/Management/StockSelect';
import Gate from '../../DashboardCommon/SingleRentDetail/Gate';

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
          to: `/${UserService.getSlugByRole(user.role)}/management/map`,
          text: 'application.boxes',
        },
        {
          className: 'tab',
          activeClassName: 'active',
          to: `/${UserService.getSlugByRole(user.role)}/management/gate`,
          text: 'application.gate',
        },
      ]}
    />

    <Switch>
      <Route
        exact
        path={`/${UserService.getSlugByRole(user.role)}/management`}
        render={() => <Redirect to={`/${UserService.getSlugByRole(user.role)}/management/map`} />}
      />
      <Route path={`/${UserService.getSlugByRole(user.role)}/management/map`} component={BoxMapManagement} />
      <Route path={`/${UserService.getSlugByRole(user.role)}/management/gate`} component={Gate} />
    </Switch>
  </Section>
);

const mapStateToProps = (state: ApplicationState) => ({
  user: state.user.details,
});

export default connect(mapStateToProps)(Management);
