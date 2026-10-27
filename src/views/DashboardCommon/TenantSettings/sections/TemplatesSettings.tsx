import React from 'react';

import { useTenantSettingsContext } from 'src/views/DashboardCommon/TenantSettings/TenantSettingsContext';
import { TemplatesManagement } from 'src/views/DashboardTenant/Templates';

export const TemplatesSettings = () => {
  const { tenantId, basePath } = useTenantSettingsContext();

  return (
    <TemplatesManagement
      basePath={`${basePath}/templates`}
      tenantId={tenantId}
    />
  );
};
