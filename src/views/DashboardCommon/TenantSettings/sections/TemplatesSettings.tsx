import React from 'react';
import { TemplatesManagement } from 'src/views/DashboardTenant/Templates';
import { useTenantSettingsContext } from '../TenantSettingsContext';

export const TemplatesSettings = () => {
  const { tenantId, basePath } = useTenantSettingsContext();

  return (
    <TemplatesManagement
      basePath={`${basePath}/templates`}
      tenantId={tenantId}
    />
  );
};
