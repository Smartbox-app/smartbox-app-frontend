import React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import { connect } from 'react-redux';

import { UserRes } from 'smartbox-types';
import { Section } from '../../../components/Layout';
import UserService from '../../../services/user-service';
import { ApplicationState } from '../../../reducers';

interface Props {
  user: UserRes;
}

const Contact = ({ user }: Props) => {
  console.log('Profile', UserService.getSlugByRole(user.role));
  return (
    <Section full>
      <h2>Strona w przygotowaniu</h2>
    </Section>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  user: state.user.details,
});

export default connect(mapStateToProps)(Contact);
