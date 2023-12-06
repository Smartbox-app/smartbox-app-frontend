import React from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import ReactCreatableSelect from 'react-select/creatable';
import { AddGiftReq, GiftRes } from 'smartbox-types';
import { ButtonsContainer, FieldsColumn } from '../../../../../../../components/Layout';
import { Button, Spinner } from '../../../../../../../components/Branded';
import ApiService from '../../../../../../../services/api-service';
import { formOnTranslateString } from '../../../../../../../utils/trans-form';

import { NewCode } from '../NewCode';
import { ReactSelectOverride } from '../../../../../../../components/Common/ReactSelectOverride';
import { useDispatch } from 'react-redux';
import { modal, notifications } from '../../../../../../../actions';
import { mapFields } from '../../../../../../../utils/fields-mapper';

interface Props {
    stockId: string;
}

const Form = ({ stockId }: Props) => {
    const dispatch = useDispatch();
    const submitButton = (
        <ButtonsContainer>
            <Button text="application.create" type="submit" primary />
        </ButtonsContainer>
    );

    const fetchUrl = 'gift/form/add-gift';
    const sendUrl = 'gift/new';

    const customSendFetcher = (formId: string, values: AddGiftReq) =>
        ApiService.sendForm(
            sendUrl,
            {
                ...values,
                stockId
            },
            'POST',
        );

    return (
        <FieldsColumn>
            <ItfApiForm
                formId="addGiftForm"
                schemaMayBeDynamic={false}
                schemaCacheEnabled={false}
                loadingInfo={<Spinner transparent />}
                schemaFetcher={() => ApiService.loadForm(fetchUrl)}
                sendFetcher={customSendFetcher}
                submitButton={submitButton}
                onSavedSuccessfully={(data: GiftRes) => {
                    dispatch(notifications.successNotification('notification.discCodeCreated'));
                    dispatch(modal.showModal(<NewCode newCodeProps={data} />));
                }}
                onRenderFullField={mapFields}
                onTranslateString={formOnTranslateString}
                thirdPartyComponents={{ ReactSelect: ReactSelectOverride, ReactCreatableSelect }}
            />
        </FieldsColumn>
    );
};

export { Form }