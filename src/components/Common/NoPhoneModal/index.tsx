import React from 'react';
import { UpdateMe } from '../../../views/DashboardCommon/Profile/Detail/UpdateMe';
import { SectionHeader } from '../../Layout';
import Alert from '../Alert';

const NoPhoneModal = () => (
  <div>
    <SectionHeader title="application.phoneNumberIsRequired" />
    <Alert type="notice" text="application.fillPhoneNumber" />
    <UpdateMe />
  </div>
);

export { NoPhoneModal };
