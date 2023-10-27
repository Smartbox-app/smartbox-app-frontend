import React from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ApiService from '../../../services/api-service';
import { FormContainer } from '../../../components/Layout';
import { LoginLogo } from '../../../components/Common';
import { Spinner, PageContent } from '../../../components/Branded';
import { formOnTranslateString } from '../../../utils/trans-form';
import { notifications } from '../../../actions';
import { mapFieldsBig } from '../../../utils/fields-mapper';
import { history } from '../../../App';
import { __ } from '../../../helpers/i18n';

import ButtonSection from './ButtonSection';

import './Register.scss';

interface Props {
    successNotification: (text: string) => void;
    match: any;
}

const Register = ({ successNotification }: Props) => (
    <PageContent>
        <LoginLogo />
        <FormContainer className="register-form">
            <ItfApiForm
                formId="UserActivationForm"
                schemaMayBeDynamic={false}
                schemaCacheEnabled={false}
                loadingInfo={<Spinner transparent />}
                schemaFetcher={() => ApiService.loadForm('user/form/add-user')}
                sendFetcher={(formId: string, values: any) => ApiService.sendForm('user/new', values, 'POST')}
                submitButton={<ButtonSection />}
                onRenderFullField={mapFieldsBig}
                onSavedSuccessfully={() => {
                    successNotification('notification.accountRegistered');
                    history.push('/register/mail-was-send');
                }}
                onTranslateString={formOnTranslateString}
            />
        </FormContainer>
    </PageContent>
);

const mapDispatchToProps = (dispatch: any): any =>
    bindActionCreators({ successNotification: notifications.successNotification }, dispatch);

export default connect(null, mapDispatchToProps)(Register);
