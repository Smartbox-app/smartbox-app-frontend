import React from 'react';

import { useTenantSettingsContext } from '../TenantSettingsContext';
import { TemplatesManagement } from '../../../DashboardTenant/Templates';

export const TemplatesSettings = () => {
  const { tenantId, basePath } = useTenantSettingsContext();

  return (
    <TemplatesManagement
      basePath={`${basePath}/templates`}
      tenantId={tenantId}
    />
  );
};
