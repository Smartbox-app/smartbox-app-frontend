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
import { useParams } from 'react-router';
import { mapFields } from '../../../../../../../utils/fields-mapper';
import { ApplicationState } from '../../../../../../../reducers';
import UserService from '../../../../../../../services/user-service';


const Edit = () => {
    const dispatch = useDispatch();
    const { gateId, stockId } = useParams<{ gateId: string, stockId: string }>();

    const user = useSelector((state: ApplicationState) => state.user.details!);


    const submitButton = (
        <ButtonsContainer>
            <Button text="application.save" type="submit" primary />
        </ButtonsContainer>
    );

    const fetchUrl = `gate/form/update/${gateId}`;
    const sendUrl = `gate/admin/${gateId}`;

    return (
        <Section>
            <SimpleHeader title="application.editGate" />
            <ButtonsContainer>
                <Button to={`/${UserService.getSlugByRole(user.role)}/locations/stocks/${stockId}/gates`} text="application.back" primary />
            </ButtonsContainer>
            <FormContainer highlight>
                <ItfApiForm
                    formId="editGate"
                    schemaCacheEnabled={false}
                    schemaMayBeDynamic={true}
                    loadingInfo={<Spinner transparent />}
                    schemaFetcher={() => ApiService.loadForm(fetchUrl)}
                    sendFetcher={(formId: string, values: any) => ApiService.sendForm(sendUrl, values, 'PATCH')}
                    submitButton={submitButton}
                    onSavedSuccessfully={() => {
                        dispatch(successNotification('notification.gateUpdatedCorrectly'));
                        history.push(`/${UserService.getSlugByRole(user.role)}/locations/stocks/${stockId}/gates`);

                    }}
                    onRenderFullField={mapFields}
                    onTranslateString={formOnTranslateString}
                    thirdPartyComponents={{ ReactSelect: ReactSelectOverride, ReactCreatableSelect }}
                />
            </FormContainer>
        </Section>
    );
};

export { Edit }
