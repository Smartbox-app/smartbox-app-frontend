import React from 'react';

import { ManageTenantSettingsForm } from 'src/views/DashboardCommon/ClientManagement/TenantSettingsForm';

type ManageTenantIntegrationsProps = {
  userId?: string;
};

const ManageTenantIntegrations = ({ userId }: ManageTenantIntegrationsProps) => (
  <ManageTenantSettingsForm
    userId={userId}
    formId="tenantIntegrationsForm"
    tenantFetchUrl="tenant/form/integrations"
    tenantSendUrl="tenant/integrations"
    adminFetchUrl={(id) => `tenant/form/admin-integrations/${id}`}
    adminSendUrl={(id) => `tenant/admin/integrations/${id}`}
  />
);

export { ManageTenantIntegrations };
