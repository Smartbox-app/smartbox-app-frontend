import React from 'react';
import { connect } from 'react-redux';

import { UserRes } from 'smartbox-types';
import { Section } from '../../../components/Layout';
import { ApplicationState } from '../../../reducers';

interface Props {
  user: UserRes;
}

const Contact = ({ user }: Props) => {
  const contactData = {
    city: 'Ostrów Wielkopolski',
    postCode: '63-400',
    street: 'ul. Wylotowa 13',
    adminContact: 'p.drobnikowski@smartbox.pl',
    adminPhone: '0048777888999',
    technicalContact: 'a.pawlowski@smartbox.pl',
    technicalPhone: '0048777888999',
    helpContact: 'pomoc@smartbox.pl',
    helpPhone: '00487665519467',
  };
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
