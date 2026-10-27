import React from 'react';

import { UserRole } from 'smartbox-types';
import { useGetMyDetailsQuery } from 'src/queries';
import { ManageTenantAnalytics } from 'src/views/DashboardCommon/ClientManagement/TenantAnalytics';
import { AnalyticsTrackingGuide } from 'src/views/DashboardCommon/TenantSettings/sections/AnalyticsTrackingGuide';
import { useTenantSettingsContext } from 'src/views/DashboardCommon/TenantSettings/TenantSettingsContext';

export const AnalyticsSettings = () => {
  const { userId } = useTenantSettingsContext();
  const { data: user } = useGetMyDetailsQuery();
  const isAdmin = user?.role === UserRole.admin;

  if (!isAdmin) {
    return <AnalyticsTrackingGuide showConfiguredIds />;
  }

  return (
    <>
      <ManageTenantAnalytics userId={userId} />
      <AnalyticsTrackingGuide />
    </>
  );
};
