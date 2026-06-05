import React from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import { useDispatch } from 'react-redux';
import { ButtonsContainer, FormContainer } from '../../../../../../components/Layout';
import { Button, Spinner } from '../../../../../../components/Branded';
import ApiService from '../../../../../../services/api-service';
import { formOnTranslateString } from '../../../../../../utils/trans-form';
import { ReactSelectOverride, ReactCreatableSelectOverride as ReactCreatableSelect } from '../../../../../../components/Common/ReactSelectOverride';
import { successNotification } from '../../../../../../actions/notifications';
import { useParams } from 'react-router';
import { mapFields } from '../../../../../../utils/fields-mapper';
import { StockGroupReq } from 'smartbox-types';


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
