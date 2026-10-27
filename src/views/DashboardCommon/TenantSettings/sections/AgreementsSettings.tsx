import React from 'react';

import { ManageTenantAgreements } from 'src/views/DashboardCommon/ClientManagement/TenantAgreements';
import { useTenantSettingsContext } from 'src/views/DashboardCommon/TenantSettings/TenantSettingsContext';

export const AgreementsSettings = () => {
  const { userId } = useTenantSettingsContext();

  return <ManageTenantAgreements userId={userId} />;
};
