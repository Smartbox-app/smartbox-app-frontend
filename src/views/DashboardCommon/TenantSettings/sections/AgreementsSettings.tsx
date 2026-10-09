import React from 'react';
import { ManageTenantAgreements } from '../../ClientManagement/TenantAgreements';
import { useTenantSettingsContext } from '../TenantSettingsContext';

export const AgreementsSettings = () => {
  const { userId } = useTenantSettingsContext();

  return <ManageTenantAgreements userId={userId} />;
};
