import React, { useEffect, useState } from "react";
import { useParams } from "react-router"
import { __ } from "../../../../../../helpers/i18n";
import ApiService from "../../../../../../services/api-service";
import { Button } from "../../../../../../components/Branded";
import { LockInfo } from "../LockInfo";
import { ButtonsContainer } from "../../../../../../components/Layout";
import './PaymentForm.scss';
import { useSelector } from "react-redux";
import { ApplicationState } from "../../../../../../reducers";

export const PaymentForm = () => {
    const { paymentId } = useParams<{ paymentId: string }>();
    const tenant = useSelector((state: ApplicationState) => state.tenant);
    
    const [hash, setHash] = useState('')
    const [payload, setPayload] = useState<any>();

    const getPaymentHash = async () => {
        await ApiService.callFetch('GET', `rent/generate-payment-hash/${paymentId}`, (response: any) => {
            const { hash, ...rest } = response;
            setHash(hash);
            setPayload(rest);
        })
    }

    useEffect(() => {
        getPaymentHash();
    }, [])

    if (!hash || !payload) return null;

    console.log('p', tenant?.useProd);

    return <form method="post" action={`https://${tenant?.useProd === false ? 'test.' : 'www.'}ipg-online.com/connect/gateway/processing`}>
        <input type="hidden" name="hashExtended" value={hash} />
        {Object.keys(payload).map(key => <input type="hidden" key={key} value={payload[key]} name={key} />)}
        <ButtonsContainer className='payment-form-button'>
            <Button big type="submit" primary text="application.pay" />
        </ButtonsContainer>
    </form>
}