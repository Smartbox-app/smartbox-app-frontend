import React from 'react';
import { ManageTenantMessaging } from '../../ClientManagement/TenantMessaging';
import { useTenantSettingsContext } from '../TenantSettingsContext';

export const MessagingSettings = () => {
  const { userId } = useTenantSettingsContext();

  return <ManageTenantMessaging userId={userId} />;
};
