import React from 'react';

import { ManageTenantIntegrations } from '../../ClientManagement/TenantIntegrations';
import { useTenantSettingsContext } from '../TenantSettingsContext';

export const IntegrationsSettings = () => {
  const { userId } = useTenantSettingsContext();

  return <ManageTenantIntegrations userId={userId} />;
};
