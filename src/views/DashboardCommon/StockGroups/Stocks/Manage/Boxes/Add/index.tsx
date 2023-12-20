import React from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import { useDispatch, useSelector } from 'react-redux';
import ReactCreatableSelect from 'react-select/creatable';
import { ButtonsContainer, FormContainer, SimpleHeader } from '../../../../../../../components/Layout';
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

    const fetchUrl = `box/form/${stockId}`;
    const sendUrl = 'box';

    return (
        <>
            <SimpleHeader title="application.addBox" />
            <ButtonsContainer>
                <Button to={`/${UserService.getSlugByRole(user.role)}/stocks/${stockId}/box`} text="application.back" primary />
            </ButtonsContainer>
            <FormContainer highlight>
                <ItfApiForm
                    formId="addBox"
                    schemaCacheEnabled={false}
                    schemaMayBeDynamic={true}
                    loadingInfo={<Spinner transparent />}
                    schemaFetcher={() => ApiService.loadForm(fetchUrl)}
                    sendFetcher={(formId: string, values: any) => ApiService.sendForm(sendUrl, { ...values, stockId })}
                    submitButton={submitButton}
                    onRenderFullField={mapFields}
                    onSavedSuccessfully={() => {
                        dispatch(successNotification('application.boxAdded'));
                        history.push(`/${UserService.getSlugByRole(user.role)}/stocks/${stockId}/boxes`);
                    }}
                    onTranslateString={formOnTranslateString}
                    thirdPartyComponents={{ ReactSelect: ReactSelectOverride, ReactCreatableSelect }}
                />
            </FormContainer>
        </>
    );
};

export { Add }
