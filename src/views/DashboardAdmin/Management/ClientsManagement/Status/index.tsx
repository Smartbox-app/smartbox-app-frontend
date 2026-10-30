import React from 'react';

import { UserClientListRes } from 'smartbox-types';
import { InvoiceStatus, PaymentServiceStatus, SmsStatus } from 'src/components/Common';
import { Modal } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';

import { StocksDetails } from '../List/StocksDetails';

interface Props {
  tenantId: string;
  user: UserClientListRes;
}

const TenantStatus = ({ tenantId, user }: Props) => {
  return (
    <>
      <Modal.Header title={__('application.tenantStatus')} />
      <Modal.Content>
        <PaymentServiceStatus tenantId={tenantId} />
        <InvoiceStatus tenantId={tenantId} />
        <SmsStatus tenantId={tenantId} />

        <StocksDetails user={user} />
      </Modal.Content>
    </>
  );
};

export { TenantStatus };
