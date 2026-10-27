import React from 'react';

import { ManageTenantCommunications } from 'src/views/DashboardCommon/ClientManagement/TenantCommunications';
import { useTenantSettingsContext } from 'src/views/DashboardCommon/TenantSettings/TenantSettingsContext';

export const CommunicationsSettings = () => {
  const { userId } = useTenantSettingsContext();

  return <ManageTenantCommunications userId={userId} />;
};
