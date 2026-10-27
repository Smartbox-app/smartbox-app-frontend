import React from 'react';

import { ManageTenantIntegrations } from 'src/views/DashboardCommon/ClientManagement/TenantIntegrations';
import { useTenantSettingsContext } from 'src/views/DashboardCommon/TenantSettings/TenantSettingsContext';

export const IntegrationsSettings = () => {
  const { userId } = useTenantSettingsContext();

  return <ManageTenantIntegrations userId={userId} />;
};
