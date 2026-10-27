import { ItfApiForm } from 'itf_formbuilder_react';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';

import { RestorPwdPetition, RestorPwdReq } from 'smartbox-types';
import { successNotification } from 'src/actions/notifications';
import { Spinner, Logo } from 'src/components/Branded';
import { FormContainer } from 'src/components/Layout';
import { InfoContent } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { history } from 'src/history';
import ApiService from 'src/services/api-service';
import { mapFieldsBig } from 'src/utils/fields-mapper';
import { formOnTranslateString } from 'src/utils/trans-form';
import ButtonsSection from './ButtonSection';

const RestorePass = () => {
    const dispatch = useDispatch();
    const { userId, updateToken } = useParams<{
        userId?: string;
        updateToken?: string;
    }>();
    const loadUrl = updateToken ? 'user/form/restore-pwd' : 'user/form/email';
    const sendUrl = updateToken ? 'user/restore-pwd' : 'user/restore-pwd-petition';
    const METHOD = updateToken ? 'PATCH' : 'POST';

    const notificationText = updateToken
        ? `${__('notification.newPassSet')}`
        : `${__('notification.msgSend')}`;
    const buttonText = updateToken ? 'application.setNewPass' : 'application.restorePass';

    const setValues = (
        values: RestorPwdPetition | Pick<RestorPwdReq, 'pwd' | 'pwd2'>,
    ) =>
        updateToken
            ? {
                ...values,
                token: updateToken,
                userId,
            }
            : values;

    return (
     <InfoContent>
            <Logo width='medium' />
            <FormContainer>
                <ItfApiForm
                    formId="loginForm"
                    schemaMayBeDynamic={false}
                    schemaCacheEnabled={false}
                    loadingInfo={<Spinner transparent />}
                    schemaFetcher={() => ApiService.loadForm(loadUrl)}
                    sendFetcher={(
                        _formId: string,
                        values: RestorPwdPetition | Pick<RestorPwdReq, 'pwd' | 'pwd2'>,
                    ) =>
                        ApiService.sendForm(sendUrl, setValues(values), METHOD)
                    }
                    submitButton={<ButtonsSection mainButtonText={buttonText} />}
                    onRenderFullField={mapFieldsBig}
                    onSavedSuccessfully={() => {
                        dispatch(successNotification(notificationText));
                        history.push('/');
                    }}
                    onTranslateString={formOnTranslateString}
                />
            </FormContainer>
        </InfoContent>
    );
};

export default RestorePass;
