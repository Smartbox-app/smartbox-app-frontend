import React from 'react';

import { ManageTenantBackground } from 'src/views/DashboardCommon/ClientManagement/Background';
import { ManageTenantIcon } from 'src/views/DashboardCommon/ClientManagement/Icon';
import { ManageTenantLogo } from 'src/views/DashboardCommon/ClientManagement/Logo';
import { useTenantSettingsContext } from 'src/views/DashboardCommon/TenantSettings/TenantSettingsContext';

export const AppearanceSettings = () => {
  const { userId } = useTenantSettingsContext();

  return (
    <>
      <ManageTenantLogo userId={userId} />
      <ManageTenantIcon userId={userId} />
      <ManageTenantBackground userId={userId} />
    </>
  );
};
