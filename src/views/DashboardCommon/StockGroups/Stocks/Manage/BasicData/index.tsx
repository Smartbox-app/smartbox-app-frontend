import React from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import { useDispatch } from 'react-redux';
import ReactCreatableSelect from 'react-select/creatable';
import {  ButtonsContainer, FormContainer } from '../../../../../../components/Layout';
import { Button, Spinner } from '../../../../../../components/Branded';
import ApiService from '../../../../../../services/api-service';
import { formOnTranslateString } from '../../../../../../utils/trans-form';
import { history } from '../../../../../../App';
import { ReactSelectOverride } from '../../../../../../components/Common/ReactSelectOverride';
import { successNotification } from '../../../../../../actions/notifications';
import { useParams } from 'react-router';
import { mapFields } from '../../../../../../utils/fields-mapper';


const BasicData = () => {
    const dispatch = useDispatch();
    const { stockId } = useParams<{stockId: string}>();

    const submitButton = (
        <ButtonsContainer>
            <Button text="application.save" type="submit" primary />
        </ButtonsContainer>
    );

    const fetchUrl = `stock/form/manage/${stockId}`;
    const sendUrl = `stock/${stockId}`;

    return (

            <FormContainer highlight>
                <ItfApiForm
                    formId="manageStock"
                    schemaMayBeDynamic={true}
                    schemaCacheEnabled={false}
                    loadingInfo={<Spinner transparent />}
                    schemaFetcher={() => ApiService.loadForm(fetchUrl)}
                    sendFetcher={(formId: string, values: any) => ApiService.sendForm(sendUrl, values, 'PATCH')}
                    submitButton={submitButton}
                    onRenderFullField={mapFields}
                    onSavedSuccessfully={() => {
                        dispatch(successNotification('notification.stockUpdatedCorrectly'));
                        history.push('/admin/locations/stocks');
                    }}
                    onTranslateString={formOnTranslateString}
                    thirdPartyComponents={{ ReactSelect: ReactSelectOverride, ReactCreatableSelect }}
                />
            </FormContainer>
    );
};

export { BasicData }
