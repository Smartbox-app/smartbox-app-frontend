import React from 'react';
import { ManageTenantRules } from '../../../DashboardCommon/ClientManagement/Rules';
import { ManageTenantPrivacy } from '../../../DashboardCommon/ClientManagement/Privacy';
import { ManageTenantAgreement } from '../../../DashboardCommon/ClientManagement/Agreement';

export const DocumentsSettings = () => (
  <>
    <ManageTenantRules />
    <ManageTenantPrivacy />
    <ManageTenantAgreement />
  </>
);
