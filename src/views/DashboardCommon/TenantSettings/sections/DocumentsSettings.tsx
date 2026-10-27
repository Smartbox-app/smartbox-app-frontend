import React from 'react';

import { ManageTenantAgreement } from 'src/views/DashboardCommon/ClientManagement/Agreement';
import { ManageTenantPrivacy } from 'src/views/DashboardCommon/ClientManagement/Privacy';
import { ManageTenantRules } from 'src/views/DashboardCommon/ClientManagement/Rules';
import { useTenantSettingsContext } from 'src/views/DashboardCommon/TenantSettings/TenantSettingsContext';

export const DocumentsSettings = () => {
  const { userId } = useTenantSettingsContext();

  return (
    <>
      <ManageTenantRules userId={userId} />
      <ManageTenantPrivacy userId={userId} />
      <ManageTenantAgreement userId={userId} />
    </>
  );
};
