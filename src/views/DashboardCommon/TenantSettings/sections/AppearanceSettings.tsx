import React from 'react';

import { ManageTenantBackground } from '../../ClientManagement/Background';
import { ManageTenantIcon } from '../../ClientManagement/Icon';
import { ManageTenantLogo } from '../../ClientManagement/Logo';
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
