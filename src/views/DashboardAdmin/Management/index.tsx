import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router';
import { UserRes } from 'smartbox-types';
import { Tabs } from '../../../components/Common';
import { Section } from '../../../components/Layout';
import { ApplicationState } from '../../../reducers';
import UserService from '../../../services/user-service';

import WorkersManagement from '../WorkersManagement';
import BoxMapManagement from '../BoxMapManagement';

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
          to: `/${UserService.getSlugByRole(user.role)}/management/workers/list`,
          text: 'Pracownicy',
        },
        {
          className: 'tab',
          activeClassName: 'active',
          to: `/${UserService.getSlugByRole(user.role)}/management/map`,
          text: 'Skrzynki',
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
    </Switch>
  </Section>
);

const mapStateToProps = (state: ApplicationState) => ({
  user: state.user.details,
});

export default connect(mapStateToProps)(Management);
