import React, { useEffect, useState } from "react"
import ApiService from "../../../services/api-service";
import Alert from "../Alert";
import './InvoiceStatus.scss';

interface Props {
    tenantId: string;
}

export const InvoiceStatus = ({ tenantId }: Props) => {
    const [status, setStatus] = useState<boolean>();

    const getStatus = async () => {
        ApiService.callFetch('GET', `tenant/invoice-service-status/${tenantId}`, (response: boolean) => setStatus(response));
    }

    useEffect(() => {
        getStatus();
    }, [])

    return <div className="tenant-invoice-status"><Alert simple type={status ? 'success' : 'error'} text={status ? 'application.invoiceConnectionOk' : 'application.invoiceConnectionBad'} /></div>
}