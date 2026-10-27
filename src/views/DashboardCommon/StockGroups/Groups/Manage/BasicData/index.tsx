import { ItfApiForm } from 'itf_formbuilder_react';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';

import { StockGroupReq } from 'smartbox-types';
import { successNotification } from 'src/actions/notifications';
import { Button, Spinner } from 'src/components/Branded';
import { ReactSelectOverride, ReactCreatableSelectOverride as ReactCreatableSelect } from 'src/components/Common/ReactSelectOverride';
import { ButtonsContainer, FormContainer } from 'src/components/Layout';
import ApiService from 'src/services/api-service';
import { mapFields } from 'src/utils/fields-mapper';
import { formOnTranslateString } from 'src/utils/trans-form';

const BasicData = () => {
    const dispatch = useDispatch();
    const { stockGroupId } = useParams<{ stockGroupId: string }>();

    const submitButton = (
        <ButtonsContainer>
            <Button text="application.save" type="submit" primary />
        </ButtonsContainer>
    );

    const fetchUrl = `stock-group/form/${stockGroupId}`;
    const sendUrl = `stock-group/${stockGroupId}`;

    return (

        <FormContainer highlight>
            <ItfApiForm
                formId="updateStockGroup"
                schemaCacheEnabled={false}
                schemaMayBeDynamic={true}
                loadingInfo={<Spinner transparent />}
                schemaFetcher={() => ApiService.loadForm(fetchUrl)}
                sendFetcher={(formId: string, values: StockGroupReq) => ApiService.sendForm(sendUrl, values, 'PATCH')}
                submitButton={submitButton}
                onRenderFullField={mapFields}
                onSavedSuccessfully={() => {
                    dispatch(successNotification('notification.stockGroupUpdatedCorrectly'));
                }}
                onTranslateString={formOnTranslateString}
                thirdPartyComponents={{ ReactSelect: ReactSelectOverride, ReactCreatableSelect }}
            />
        </FormContainer>
    );
};

export { BasicData }
