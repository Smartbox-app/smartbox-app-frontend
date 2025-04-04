import React from 'react';
import { InvoiceStatus, SmsStatus } from '../../../components/Common';
import './TenantStatus.scss';
import { useGetMyDetailsQuery } from 'src/queries';

export const TenantStatus = () => {
  const { data: user } = useGetMyDetailsQuery();

  if (!user || !user.tenantId) return null;

  return (
    <div className="tenant-status-container">
      <InvoiceStatus tenantId={user.tenantId} />
      <SmsStatus tenantId={user.tenantId!} />
    </div>
  );
};
