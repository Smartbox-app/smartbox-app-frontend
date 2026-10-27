import React from 'react';

import { ManageTenantMobileApps } from 'src/views/DashboardCommon/ClientManagement/TenantMobileApps';
import { useTenantSettingsContext } from 'src/views/DashboardCommon/TenantSettings/TenantSettingsContext';

export const MobileAppsSettings = () => {
  const { userId } = useTenantSettingsContext();

  return <ManageTenantMobileApps userId={userId} />;
};
