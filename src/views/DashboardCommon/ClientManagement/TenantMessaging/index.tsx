import React from 'react';
import { ManageTenantSettingsForm } from '../TenantSettingsForm';

interface Props {
  userId?: string;
}

const ManageTenantMessaging = ({ userId }: Props) => (
  <ManageTenantSettingsForm
    userId={userId}
    formId="tenantMessagingForm"
    tenantFetchUrl="tenant/form/messaging"
    tenantSendUrl="tenant/messaging"
    adminFetchUrl={(id) => `tenant/form/admin-messaging/${id}`}
    adminSendUrl={(id) => `tenant/admin/messaging/${id}`}
  />
);

export { ManageTenantMessaging };
