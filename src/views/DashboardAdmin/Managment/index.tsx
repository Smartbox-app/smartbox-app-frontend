import React, { Component } from 'react';
import { connect } from 'react-redux';
import { IUser } from 'smartbox-types';
import { Switch, Route, Redirect } from 'react-router';
import UserService from '../../../services/user-service';
import { Tabs } from '../../../components/Common';
import WorkersManagement from '../WorkersManagement';
import { Section } from '../../../components/Layout';
import BoxMapManagment from '../BoxMapManagment';
import DiscountCodes from '../DiscountCodes';

interface Props {
  user: IUser;
}

class Managment extends Component<Props> {
  private test = () => {};

  render() {
    const { user } = this.props;
    return (
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
            {
              className: 'tab',
              activeClassName: 'active',
              to: `/${UserService.getSlugByRole(user.role)}/managment/codes`,
              text: 'Rabaty',
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
          <Route path={`/${UserService.getSlugByRole(user.role)}/managment/codes`} component={DiscountCodes} />
        </Switch>
      </Section>
    );
  }
}

const mapStateToProps = (state: any) => ({
  user: state.user.details,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Managment);
