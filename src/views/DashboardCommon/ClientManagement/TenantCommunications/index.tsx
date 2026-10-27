import React from 'react';

import { ManageTenantSettingsForm } from '../TenantSettingsForm';

type ManageTenantCommunicationsProps = {
  userId?: string;
};

const ManageTenantCommunications = ({
  userId,
}: ManageTenantCommunicationsProps) => (
  <ManageTenantSettingsForm
    userId={userId}
    formId="tenantCommunicationsForm"
    tenantFetchUrl="tenant/form/communications"
    tenantSendUrl="tenant/communications"
    adminFetchUrl={(id) => `tenant/form/admin-communications/${id}`}
    adminSendUrl={(id) => `tenant/admin/communications/${id}`}
  />
);

export { ManageTenantCommunications };
