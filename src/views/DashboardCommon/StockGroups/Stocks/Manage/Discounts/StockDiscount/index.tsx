import React, { useState } from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import ReactCreatableSelect from 'react-select/creatable';
import { DiscountReq } from 'smartbox-types';
import { useDispatch } from 'react-redux';
import flatpickr from 'flatpickr';
import { FormContainer, ButtonsContainer, FieldsColumn } from '../../../../../../../components/Layout';
import { Button, Spinner } from '../../../../../../../components/Branded';
import FormHeader from '../../../../../../../components/Layout/FormHeader';
import ApiService from '../../../../../../../services/api-service';
import { formOnTranslateString } from '../../../../../../../utils/trans-form';
import { notifications } from '../../../../../../../actions';
import { ReactSelectOverride } from '../../../../../../../components/Common/ReactSelectOverride';
import { useParams } from 'react-router';
import { mapFields } from '../../../../../../../utils/fields-mapper';
import { successNotification } from '../../../../../../../actions/notifications';
import styled from 'styled-components';
import { Header } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';

const StyledWrapper = styled.div`
border-bottom: 1px solid ${props => props.theme.colors.primary};
margin-bottom: 15px;
padding-bottom: 15px;
`

const StockDiscount = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState<boolean>(false);
    const { stockId } = useParams<{ stockId: string }>();

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
                <Header variant='h2'>{__("application.stockDiscount")}</Header>
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
