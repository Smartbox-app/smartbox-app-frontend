import React from 'react';

import { ManageTenantSettingsForm } from 'src/views/DashboardCommon/ClientManagement/TenantSettingsForm';

type ManageTenantAgreementsProps = {
  userId?: string;
};

const ManageTenantAgreements = ({ userId }: ManageTenantAgreementsProps) => (
  <ManageTenantSettingsForm
    userId={userId}
    formId="tenantAgreementsForm"
    tenantFetchUrl="tenant/form/agreements"
    tenantSendUrl="tenant/agreements"
    adminFetchUrl={(id) => `tenant/form/admin-agreements/${id}`}
    adminSendUrl={(id) => `tenant/admin/agreements/${id}`}
  />
);

export { ManageTenantAgreements };
