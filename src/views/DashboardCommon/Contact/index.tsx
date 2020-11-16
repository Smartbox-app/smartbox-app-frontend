import React from 'react';
import { connect } from 'react-redux';

import { UserRes } from 'smartbox-types';
import { Section } from '../../../components/Layout';
import { ApplicationState } from '../../../reducers';
import SingleDepartment from './SingleDepartment';

import './Contact.scss';

interface Props {
  user: UserRes;
}

const Contact = ({ user }: Props) => {
  const contactData = {
    city: 'Ostrów Wielkopolski',
    postCode: '63-400',
    street: 'ul. Wylotowa 13',
    adminContact: 'p.drobnikowski@smartbox.pl',
    adminPhone: '0048665519467',
    technicalContact: 'a.pawlowski@smartbox.pl',
    technicalPhone: '0048665519467',
    helpContact: 'pomoc@smartbox.pl',
    helpPhone: '0048665519467',
  };
  return (
    <Section full>
      <h2>Zapraszamy do kontaktu:</h2>
      <div className="department-wrapper">
        <SingleDepartment
          organisationRole="Administrator"
          name="Piotr Drobnikowski"
          phone={contactData.adminPhone}
          mail={contactData.adminContact}
        />
        <SingleDepartment
          organisationRole="Pomoc techniczna"
          name="Adam Pawłowski"
          phone={contactData.adminPhone}
          mail={contactData.technicalContact}
        />
        <SingleDepartment
          organisationRole="Pomoc ogólna"
          name=""
          phone={contactData.helpPhone}
          mail={contactData.helpContact}
        />
      </div>
    </Section>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  user: state.user.details,
});

export default connect(mapStateToProps)(Contact);
