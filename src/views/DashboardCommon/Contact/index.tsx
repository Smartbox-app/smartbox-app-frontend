import React from 'react';
import { PageHeader } from '../../../components/Layout';
import SingleDepartment from './SingleDepartment';

import './Contact.scss';

const Contact = () => {
  return (
    <>
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
        <SingleDepartment
          organisationRole=""
          name="Pomoc ogólna"
          phone=""
          mail="pomoc@smartbox-storage.pl"
        />
      </div>
    </>
  );
};

export default Contact;
