import React from 'react';
import { useParams } from 'react-router';

import { TenantSettings } from 'src/views/DashboardCommon/TenantSettings';

export const AdminTenantSettings = () => {
  const { userId, tenantId } = useParams<{ userId: string; tenantId: string }>();

  if (!userId || !tenantId) return null;

  return (
    <TenantSettings
      userId={userId}
      tenantId={tenantId}
      basePath={`/admin/management/clients/${userId}/${tenantId}/settings`}
      backTo="/admin/management/clients/list"
    />
  );
};
