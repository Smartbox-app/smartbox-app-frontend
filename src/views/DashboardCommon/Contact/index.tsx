import React from 'react';
import { connect } from 'react-redux';

import { UserRes } from 'smartbox-types';
import { Section } from '../../../components/Layout';
import { ApplicationState } from '../../../reducers';

interface Props {
  user: UserRes;
}

const Contact = ({ user }: Props) => {
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
