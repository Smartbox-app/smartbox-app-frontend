import React from 'react';

import Alert from 'src/components/Common/Alert';
import { Modal } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';

import { UpdateMe } from '../../../views/DashboardCommon/Profile/Detail/UpdateMe';

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
