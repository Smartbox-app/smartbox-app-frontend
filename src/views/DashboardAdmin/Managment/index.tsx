import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router';
import { UserRes } from 'smartbox-types';
import { Tabs } from '../../../components/Common';
import { Section } from '../../../components/Layout';
import { ApplicationState } from '../../../reducers';
import UserService from '../../../services/user-service';

import WorkersManagement from '../WorkersManagement';
import BoxMapManagment from '../BoxMapManagment';

interface Props {
  user: UserRes;
}

const Managment = ({ user }: Props) => (
  <Section full>
    <Tabs
      tabs={[
        {
          className: 'tab',
          activeClassName: 'active',
          to: `/${UserService.getSlugByRole(user.role)}/managment/workers/list`,
          text: 'Pracownicy',
        },
        {
          className: 'tab',
          activeClassName: 'active',
          to: `/${UserService.getSlugByRole(user.role)}/managment/map`,
          text: 'Skrzynki',
        },
      ]}
    />
    <Switch>
      <Route
        exact
        path={`/${UserService.getSlugByRole(user.role)}/managment`}
        render={() => <Redirect to={`/${UserService.getSlugByRole(user.role)}/managment/workers`} />}
      />
      <Route path={`/${UserService.getSlugByRole(user.role)}/managment/workers`} component={WorkersManagement} />
      <Route path={`/${UserService.getSlugByRole(user.role)}/managment/map`} component={BoxMapManagment} />
    </Switch>
  </Section>
);

const mapStateToProps = (state: ApplicationState) => ({
  user: state.user.details,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Managment);
