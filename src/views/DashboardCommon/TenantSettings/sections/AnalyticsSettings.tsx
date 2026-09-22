import React from 'react';
import { ManageTenantAnalytics } from '../../ClientManagement/TenantAnalytics';
import { useTenantSettingsContext } from '../TenantSettingsContext';

export const AnalyticsSettings = () => {
  const { userId } = useTenantSettingsContext();

  return <ManageTenantAnalytics userId={userId} />;
};
