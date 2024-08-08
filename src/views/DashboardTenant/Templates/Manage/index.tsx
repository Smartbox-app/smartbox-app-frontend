import React from 'react';
import { useDispatch } from "react-redux";
import { useParams } from "react-router"
import { Button, Spinner } from "../../../../components/Branded";
import { ButtonsContainer, FormContainer, FormHeader } from "../../../../components/Layout";
import { ItfApiForm } from 'itf_formbuilder_react';
import ApiService from '../../../../services/api-service';
import { mapFields } from '../../../../utils/fields-mapper';
import { successNotification } from '../../../../actions/notifications';
import { formOnTranslateString } from '../../../../utils/trans-form';
import { hideModal } from '../../../../actions/modal';
import { TemplateType } from 'smartbox-types';

export const Manage = () => {
    const { type, template } = useParams<{ type: 'email' | 'sms', template: TemplateType }>();

    const dispatch = useDispatch();

    const submitButton = (
        <ButtonsContainer>
            <Button text="application.save" type="submit" primary />
        </ButtonsContainer>
    );


    const fetchUrl = `template/form-${type}/${template}`;
    const sendUrl = `template/${type}/${template}`;

    return (
        <FormContainer>
            <FormHeader title="application.manageTemplate" />
            <ItfApiForm
                formId="manageTemplate"
                schemaCacheEnabled={false}
                schemaMayBeDynamic={true}
                useFormDataInsteadOfPlainObject
                loadingInfo={<Spinner transparent />}
                schemaFetcher={() => ApiService.loadForm(fetchUrl)}
                sendFetcher={(formId: string, values) => {
                    return ApiService.sendForm(sendUrl, values, 'PATCH')
                }
                }
                submitButton={submitButton}
                onRenderFullField={mapFields}
                onSavedSuccessfully={() => {
                    dispatch(successNotification('application.templateSaved'));
                    dispatch(hideModal());
                }}
                onTranslateString={formOnTranslateString}
            />
        </FormContainer>
    );
}