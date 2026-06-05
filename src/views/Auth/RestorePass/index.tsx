import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ItfApiForm } from 'itf_formbuilder_react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { AuthLoginResult, RestorPwdReq } from 'smartbox-types';
import { Input, LoginLogo } from '../../../components/Common';
import { Spinner, PageContent, Logo } from '../../../components/Branded';
import { notifications } from '../../../actions';
import ApiService from '../../../services/api-service';
import { translateErrors } from '../../../utils/errors-trans';
import { formOnTranslateString } from '../../../utils/trans-form';
import { FormContainer } from '../../../components/Layout';
import { ApplicationState } from '../../../reducers';
import { __ } from '../../../helpers/i18n';
import { history } from '../../../App';

import ButtonsSection from './ButtonSection';

import { mapFieldsBig } from '../../../utils/fields-mapper';
import { InfoContent } from 'src/components/ui';

interface RouteProps {
    userId: string;
    updateToken: string;
}
interface Props extends RouteComponentProps<RouteProps> {
    successNotification: (text: string) => void;
}
const RestorePass = ({ successNotification, match }: Props) => {
    const loadUrl = match.params.updateToken ? 'user/form/restore-pwd' : 'user/form/email';
    const sendUrl = match.params.updateToken ? 'user/restore-pwd' : 'user/restore-pwd-petition';
    const METHOD = match.params.updateToken ? 'PATCH' : 'POST';

    const notificationText = match.params.updateToken
        ? `${__('notification.newPassSet')}`
        : `${__('notification.msgSend')}`;
    const buttonText = match.params.updateToken ? 'application.setNewPass' : 'application.restorePass';

    const setValues = (values: any) =>
        match.params.updateToken
            ? {
                ...values,
                token: match.params.updateToken,
                userId: match.params.userId,
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
                    sendFetcher={(formId: string, values: AuthLoginResult | RestorPwdReq) =>
                        ApiService.sendForm(sendUrl, setValues(values), METHOD)
                    }
                    submitButton={<ButtonsSection mainButtonText={buttonText} />}
                    onRenderFullField={mapFieldsBig}
                    onSavedSuccessfully={() => {
                        successNotification(notificationText);
                        history.push('/');
                    }}
                    onTranslateString={formOnTranslateString}
                />
            </FormContainer>
        </InfoContent>
    );
};

const mapStateToProps = (state: ApplicationState): any => ({
    loading: state.spinner.loading,
});

const mapDispatchToProps = (dispatch: any): any =>
    bindActionCreators(
        {
            ...notifications,
        },
        dispatch,
    );
const RestorePassWithRouter = withRouter(RestorePass);
export default connect(mapStateToProps, mapDispatchToProps)(RestorePassWithRouter);
