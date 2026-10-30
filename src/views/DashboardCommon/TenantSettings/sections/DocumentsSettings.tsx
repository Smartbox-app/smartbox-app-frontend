import React from 'react';

import { ManageTenantAgreement } from '../../ClientManagement/Agreement';
import { ManageTenantPrivacy } from '../../ClientManagement/Privacy';
import { ManageTenantRules } from '../../ClientManagement/Rules';
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
