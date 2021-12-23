import React from 'react';
import { connect } from 'react-redux';

import { UserRes } from 'smartbox-types';
import { PageHeader, Section, SectionHeader } from '../../../components/Layout';
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
    <div className="contact-wrapper">
      <Section full>
        <PageHeader title='application.welcomeToContact' />
        <div className="department-wrapper">
          <SingleDepartment
            organisationRole="Biuro obsługi klienta"
            name="Piotr Drobnikowski"
            phone="510298876"
            mail="pomoc@smartbox-storage.pl"
            openHour="8:00"
            closeHour="16:00"
          />

          <SingleDepartment
            organisationRole="Pomoc techniczna"
            name="Adrian Pawłowski"
            phone="731400331"
            mail="adrian@smartbox-storage.pl"
            openHour="8:00"
            closeHour="16:00"
          />
          <SingleDepartment organisationRole="" name="Pomoc ogólna" phone="" mail="pomoc@smartbox-storage.pl" />
        </div>
      </Section>
    </div>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  user: state.user.details,
});

export default connect(mapStateToProps)(Contact);
