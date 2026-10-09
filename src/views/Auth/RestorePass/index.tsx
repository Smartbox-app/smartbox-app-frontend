import React from 'react';
import { useDispatch } from 'react-redux';
import { ItfApiForm } from 'itf_formbuilder_react';
import { useParams } from 'react-router';
import { RestorPwdPetition, RestorPwdReq } from 'smartbox-types';

import { Spinner, Logo } from '../../../components/Branded';
import { successNotification } from '../../../actions/notifications';
import ApiService from '../../../services/api-service';

import { formOnTranslateString } from '../../../utils/trans-form';
import { FormContainer } from '../../../components/Layout';
import { __ } from '../../../helpers/i18n';
import { history } from 'src/history';

import ButtonsSection from './ButtonSection';

import { mapFieldsBig } from '../../../utils/fields-mapper';
import { InfoContent } from 'src/components/ui';

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
