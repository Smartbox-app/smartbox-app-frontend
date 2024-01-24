import React from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import { useDispatch, useSelector } from 'react-redux';
import ReactCreatableSelect from 'react-select/creatable';
import { PageHeader, ButtonsContainer, FormContainer, Section, SimpleHeader } from '../../../../../../../components/Layout';
import { Button, Spinner } from '../../../../../../../components/Branded';
import ApiService from '../../../../../../../services/api-service';
import { formOnTranslateString } from '../../../../../../../utils/trans-form';
import { history } from '../../../../../../../App';
import { ReactSelectOverride } from '../../../../../../../components/Common/ReactSelectOverride';
import { successNotification } from '../../../../../../../actions/notifications';
import { __ } from '../../../../../../../helpers/i18n';
import UserService from '../../../../../../../services/user-service';
import { ApplicationState } from '../../../../../../../reducers';
import { mapFields } from '../../../../../../../utils/fields-mapper';
import { useParams } from 'react-router';


const Add = () => {
    const dispatch = useDispatch();
    const { stockId } = useParams<{ stockId: string }>();

    const user = useSelector((state: ApplicationState) => state.user.details!);

    const submitButton = (
        <ButtonsContainer>
            <Button text="application.save" type="submit" primary />
        </ButtonsContainer>
    );

    const fetchUrl = 'box-group-new/form';
    const sendUrl = 'box-group-new';

    return (
        <>
            <SimpleHeader title="application.addBoxGroup" />
            <ButtonsContainer>
                <Button to={`/${UserService.getSlugByRole(user.role)}/locations/stocks/${stockId}/groups`} text="application.back" primary />
            </ButtonsContainer>
            <FormContainer highlight>
                <ItfApiForm
                    formId="addBoxGroup"
                    schemaCacheEnabled={false}
                    schemaMayBeDynamic={true}
                    useFormDataInsteadOfPlainObject
                    loadingInfo={<Spinner transparent />}
                    schemaFetcher={() => ApiService.loadForm(fetchUrl)}
                    sendFetcher={(formId: string, values: FormData) => {
                        values.set('stockId', stockId);
                        return ApiService.sendForm(sendUrl, values)}
                    }
                    submitButton={submitButton}
                    onRenderFullField={mapFields}
                    onSavedSuccessfully={() => {
                        dispatch(successNotification('application.boxGroupAdded'));
                        history.push(`/${UserService.getSlugByRole(user.role)}/locations/stocks/${stockId}/groups`);
                    }}
                    onTranslateString={formOnTranslateString}
                    thirdPartyComponents={{ ReactSelect: ReactSelectOverride, ReactCreatableSelect }}
                />
            </FormContainer>
        </>
    );
};

export { Add }
