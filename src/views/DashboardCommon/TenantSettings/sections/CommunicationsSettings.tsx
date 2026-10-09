import React from 'react';
import { ManageTenantCommunications } from '../../ClientManagement/TenantCommunications';
import { useTenantSettingsContext } from '../TenantSettingsContext';

export const CommunicationsSettings = () => {
  const { userId } = useTenantSettingsContext();

  return <ManageTenantCommunications userId={userId} />;
};
