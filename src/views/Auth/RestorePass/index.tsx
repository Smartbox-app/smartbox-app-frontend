import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ItfApiForm } from 'itf_formbuilder_react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { AuthLoginResult, RestorPwdReq } from 'smartbox-types';
import { Spinner, Input, LoginLogo } from '../../../components/Common';
import { notifications } from '../../../actions';
import ApiService from '../../../services/api-service';
import { translateErrors } from '../../../utils/errors-trans';
import { formOnTranslateString } from '../../../utils/trans-form';
import { FormContainer, PageContent } from '../../../components/Layout';
import { ApplicationState } from '../../../reducers';
import { __ } from '../../../helpers/i18n';
import { history } from '../../../App';

import ButtonsSection from './ButtonSection';

import './RestorePass.scss';

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
    <PageContent>
      <LoginLogo />
      <FormContainer className="restore-pass-form">
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
          onRenderFullField={(field, errors, fieldHtmlId, currentValue, onChange, onFocus, onBlur) => {
            switch (field.type) {
              case 'text':
                return (
                  <Input
                    className="login-input"
                    type={field.options.type}
                    input={{
                      label: formOnTranslateString(field.title),
                      name: fieldHtmlId,
                      id: fieldHtmlId,
                      placeholder: field.placeholder,
                      errors: translateErrors(errors),
                      value: currentValue,
                      onChange: (e: any) => onChange(e.target.value),
                      onFocus,
                      onBlur,
                    }}
                  />
                );
              case 'variablePlaceholder':
                return null;
              default:
                return null;
            }
          }}
          onSavedSuccessfully={() => {
            successNotification(notificationText);
            history.push('/');
          }}
          onTranslateString={formOnTranslateString}
        />
      </FormContainer>
    </PageContent>
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
