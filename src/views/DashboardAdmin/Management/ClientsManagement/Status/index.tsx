import React from 'react';
import { InvoiceStatus, SmsStatus } from '../../../../../components/Common';
import { SimpleHeader } from '../../../../../components/Layout';

interface Props {
    tenantId: string;
}

const TenantStatus = ({ tenantId }: Props) => {
    return (
        <>
            <SimpleHeader title='application.tenantStatus' />
            <InvoiceStatus tenantId={tenantId} />
            <SmsStatus tenantId={tenantId} />
        </>
    );
};

export { TenantStatus }