import React from 'react';
import { ManageTenantMobileApps } from '../../ClientManagement/TenantMobileApps';
import { useTenantSettingsContext } from '../TenantSettingsContext';

export const MobileAppsSettings = () => {
  const { userId } = useTenantSettingsContext();

  return <ManageTenantMobileApps userId={userId} />;
};
