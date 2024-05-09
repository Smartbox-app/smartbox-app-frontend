import React, { useEffect, useState } from "react";
import { useParams } from "react-router"
import { __ } from "../../../../../../helpers/i18n";
import ApiService from "../../../../../../services/api-service";

export const PaymentForm = () => {
    const { paymentId } = useParams<{ paymentId: string }>();

    const [hash, setHash] = useState('')
    const [payload, setPayload] = useState<any>();

    const getPaymentHash = async () => {
        await ApiService.callFetch('GET', `rent/generate-payment-hash/${paymentId}`, (response: any) => {
            console.log('RESPONSE', response);
            const { hash, ...rest} = response;
            setHash(hash);
            setPayload(rest);
        })
    }

    useEffect(() => {
        getPaymentHash();
    }, [])

    if (!hash || !payload) return null;

    return <form method="post" action='https://test.ipg-online.com/connect/gateway/processing'>
        <input type="hidden" name="hashExtended" value={hash} />
        {Object.keys(payload).map(key => <input type="hidden" key={key} value={payload[key]} name={key} />)}
        <button type="submit">{__('application.pay')}</button>
    </form>
}