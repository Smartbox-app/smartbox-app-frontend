import React from 'react';
import { UpdateMe } from '../../../views/DashboardCommon/Profile/Detail/UpdateMe';
import { Modal } from 'src/components/ui';
import Alert from '../Alert';
import { __ } from 'src/helpers/i18n';

const NoPhoneModal = () => (
  <>
    <Modal.Header title={__('application.phoneNumberIsRequired')} />
    <Modal.Content>
      <Alert type="notice" text="application.fillPhoneNumber" />
      <UpdateMe />
    </Modal.Content>
  </>
);

export { NoPhoneModal };
