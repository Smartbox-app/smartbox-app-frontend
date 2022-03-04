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
  return (
    <div className="contact-wrapper">
      <Section full>
        <PageHeader title="application.welcomeToContact" />
        <div className="department-wrapper">
          <SingleDepartment
            organisationRole="Biuro obsługi klienta"
            name="Adrian Pawłowski"
            phone="731400331"
            mail="kontakt@smartbox-storage.pl"
            openHour="8:00"
            closeHour="16:00"
          />

          <SingleDepartment
            organisationRole="Pomoc techniczna"
            name="Piotr Drobnikowski"
            phone="510298876"
            mail="kontakt@smartbox-storage.pl"
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
