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
import DiscountCodes from '../DiscountCodes';

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
          to: `/${UserService.getSlugByRole(user.role)}/Management/workers/list`,
          text: 'Pracownicy',
        },
        {
          className: 'tab',
          activeClassName: 'active',
          to: `/${UserService.getSlugByRole(user.role)}/Management/map`,
          text: 'Skrzynki',
        },
        {
          className: 'tab',
          activeClassName: 'active',
          to: `/${UserService.getSlugByRole(user.role)}/Management/discount`,
          text: 'Kody rabatowe',
        },
      ]}
    />
    <Switch>
      <Route
        exact
        path={`/${UserService.getSlugByRole(user.role)}/Management`}
        render={() => <Redirect to={`/${UserService.getSlugByRole(user.role)}/Management/workers`} />}
      />
      <Route path={`/${UserService.getSlugByRole(user.role)}/Management/workers`} component={WorkersManagement} />
      <Route path={`/${UserService.getSlugByRole(user.role)}/Management/map`} component={BoxMapManagement} />
      <Route path={`/${UserService.getSlugByRole(user.role)}/Management/discount`} component={DiscountCodes} />
    </Switch>
  </Section>
);

const mapStateToProps = (state: ApplicationState) => ({
  user: state.user.details,
});

export default connect(mapStateToProps)(Management);
