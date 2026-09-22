import React from 'react';
import { ManageTenantRules } from '../../ClientManagement/Rules';
import { ManageTenantPrivacy } from '../../ClientManagement/Privacy';
import { ManageTenantAgreement } from '../../ClientManagement/Agreement';
import { useTenantSettingsContext } from '../TenantSettingsContext';

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
