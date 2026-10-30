import flatpickr from 'flatpickr';
import { ItfApiForm } from 'itf_formbuilder_react';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';

import { DiscountReq } from 'smartbox-types';
import { notifications } from 'src/actions';
import { successNotification } from 'src/actions/notifications';
import { Button, Spinner } from 'src/components/Branded';
import { ReactSelectOverride, ReactCreatableSelectOverride as ReactCreatableSelect } from 'src/components/Common/ReactSelectOverride';
import { FormContainer, ButtonsContainer, FieldsColumn } from 'src/components/Layout';
import { Header } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { useTenantNaming } from 'src/hooks/useTenantNaming';
import ApiService from 'src/services/api-service';
import { mapFields } from 'src/utils/fields-mapper';
import { formOnTranslateString } from 'src/utils/trans-form';

const StockDiscount = () => {
    const dispatch = useDispatch();
    const [, setLoading] = useState<boolean>(false);
    const { stockId } = useParams<{ stockId: string }>();
    const {getText} = useTenantNaming();

    const deleteDiscount = async () => {
        setLoading(true);
        await ApiService.callFetch('DELETE', `stock/${stockId}/discount`, () => {
            dispatch(successNotification('application.discountDeleted'))
        })
        setLoading(false);
    }

    const submitButton = (
        <ButtonsContainer>
            <Button text="application.delete" type="button" danger click={deleteDiscount} />
            <Button text="application.save" type="submit" primary />
        </ButtonsContainer>
    );

    const fetchUrl = `stock/form/discount/${stockId}`;
    const sendUrl = `stock/${stockId}/discount`;

    const customSendFetcher = (formId: string, values: DiscountReq) =>
        ApiService.sendForm(
            sendUrl,
            {
                ...values,
                stockId,
            },
            'PATCH',
        );

    return (
        <>
            <FormContainer highlight>
                <Header variant='h2'>{getText('discount')}</Header>
                <FieldsColumn>
                    <ItfApiForm
                        formId="addStockDiscountForm"
                        schemaMayBeDynamic={false}
                        schemaCacheEnabled={false}
                        loadingInfo={<Spinner transparent />}
                        schemaFetcher={() => ApiService.loadForm(fetchUrl)}
                        sendFetcher={customSendFetcher}
                        submitButton={submitButton}
                        onSavedSuccessfully={() => {
                            dispatch(notifications.successNotification('notification.stockDiscountCreated'));
                        }}
                        onRenderFullField={mapFields}
                        onTranslateString={formOnTranslateString}
                        thirdPartyComponents={{ ReactSelect: ReactSelectOverride, ReactCreatableSelect, flatpickr }}
                    />
                </FieldsColumn>
            </FormContainer>
        </>
    );
};

export { StockDiscount }
