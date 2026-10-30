import React from 'react';

import { ManageTenantSettingsForm } from '../TenantSettingsForm';

interface Props {
  userId?: string;
}

const ManageTenantMobileApps = ({ userId }: Props) => (
  <ManageTenantSettingsForm
    userId={userId}
    formId="tenantMobileAppsForm"
    tenantFetchUrl="tenant/form/mobile-apps"
    tenantSendUrl="tenant/mobile-apps"
    adminFetchUrl={(id) => `tenant/form/admin-mobile-apps/${id}`}
    adminSendUrl={(id) => `tenant/admin/mobile-apps/${id}`}
  />
);

export { ManageTenantMobileApps };
