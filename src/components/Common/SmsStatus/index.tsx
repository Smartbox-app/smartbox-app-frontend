import React, { useEffect, useState } from "react"
import ApiService from "../../../services/api-service";
import Alert from "../Alert";

import './SmsStatus.scss';

interface Props {
    tenantId: string;
}

export const SmsStatus = ({ tenantId }: Props) => {
    const [status, setStatus] = useState<boolean>();

    const getStatus = async () => {
        ApiService.callFetch('GET', `tenant/sms-service-status/${tenantId}`, (response: boolean) => setStatus(response));
    }

    useEffect(() => {
        getStatus();
    }, []);

    return <div className="tenant-sms-status"><Alert simple type={status ? 'success' : 'error'} text={status ? 'application.smsConnectionOk' : 'application.smsConnectionBad'} /></div>
}