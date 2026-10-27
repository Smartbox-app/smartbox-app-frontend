import React from 'react';

import { PageHeader } from 'src/components/Layout';
import SingleDepartment from 'src/views/DashboardCommon/Contact/SingleDepartment';

import 'src/views/DashboardCommon/Contact/Contact.scss';

const Contact = () => {
  return (
    <>
      <PageHeader title="application.welcomeToContact" />
      <div className="department-wrapper">
        <SingleDepartment
          organisationRole="application.phrases.contactCustomerService"
          name="Adrian Pawłowski"
          phone="731400331"
          mail="kontakt@smartbox-storage.pl"
          openHour="8:00"
          closeHour="16:00"
        />

        <SingleDepartment
          organisationRole="application.phrases.contactTechnicalSupport"
          name="Piotr Drobnikowski"
          phone="510298876"
          mail="kontakt@smartbox-storage.pl"
          openHour="8:00"
          closeHour="16:00"
        />
        <SingleDepartment
          organisationRole=""
          name="application.phrases.contactGeneralHelp"
          phone=""
          mail="pomoc@smartbox-storage.pl"
        />
      </div>
    </>
  );
};

export default Contact;
