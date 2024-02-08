import React from 'react';
import { InvoiceStatus, SmsStatus } from '../../../components/Common';
import { useSelector } from 'react-redux';
import { ApplicationState } from '../../../reducers';
import './TenantStatus.scss';

export const TenantStatus = () => {
    const user = useSelector((state: ApplicationState) => state.user.details!);
    return <div className='tenant-status-container'>
        <InvoiceStatus tenantId={user.tenantId!} />
        <SmsStatus tenantId={user.tenantId!} />
    </div>
}