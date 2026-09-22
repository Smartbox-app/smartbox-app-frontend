import React from 'react';
import { ManageTenantLogo } from '../../ClientManagement/Logo';
import { ManageTenantIcon } from '../../ClientManagement/Icon';
import { ManageTenantBackground } from '../../ClientManagement/Background';
import { useTenantSettingsContext } from '../TenantSettingsContext';

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
