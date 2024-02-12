import React from 'react';
import { UserClientListRes } from 'smartbox-types';
import { InvoiceStatus, SmsStatus } from '../../../../../components/Common';
import { SimpleHeader } from '../../../../../components/Layout';
import { StocksDetails } from '../List/StocksDetails';

interface Props {
    tenantId: string;
    user: UserClientListRes;
}

const TenantStatus = ({ tenantId, user }: Props) => {
    return (
        <>
            <SimpleHeader title='application.tenantStatus' />
            <InvoiceStatus tenantId={tenantId} />
            <SmsStatus tenantId={tenantId} />
            <StocksDetails user={user} />
        </>
    );
};

export { TenantStatus }