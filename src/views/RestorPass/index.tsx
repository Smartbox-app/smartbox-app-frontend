import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ItfApiForm } from 'itf_formbuilder_react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { AuthLoginResult } from 'smartbox-types';
import { Spinner, Input, LoginLogo } from '../../components/Common';
import { notifications } from '../../actions';
import ApiService from '../../services/api-service';
import { formOnTranslateString } from '../../utils/trans-form';
import { FormContainer, PageContent } from '../../components/Layout';
import { ApplicationState } from '../../reducers';

import ButtonsSection from './ButtonSection';

import './RestorPass.scss';

interface RouteProps {
  userId: string;
  updateToken: string;
}
interface Props extends RouteComponentProps<RouteProps> {
  successNotification: (text: string) => void;
}
const RestorPass = ({ successNotification, match }: Props) => {
  const loadUrl = match.params.updateToken ? 'user/form/email' : 'user/form/email';
  const sendUrl = match.params.updateToken ? 'user/restor-pwd-petition' : 'user/restor-pwd-petition';

  return (
    <PageContent>
      <LoginLogo />
      <FormContainer className="restor-pass-form">
        <ItfApiForm
          formId="loginForm"
          schemaMayBeDynamic={false}
          schemaCacheEnabled={false}
          loadingInfo={<Spinner transparent />}
          schemaFetcher={() => ApiService.loadForm(loadUrl)}
          sendFetcher={(formId: string, values: AuthLoginResult) => ApiService.sendForm(sendUrl, values, 'POST')}
          submitButton={<ButtonsSection />}
          onRenderFullField={(field, errors, fieldHtmlId, currentValue, onChange, onFocus, onBlur) => {
            switch (field.type) {
              case 'text':
                return (
                  <Input
                    className="login-input"
                    type={field.options.type}
                    input={{
                      label: field.title,
                      name: fieldHtmlId,
                      id: fieldHtmlId,
                      placeholder: field.placeholder,
                      errors,
                      value: currentValue,
                      onChange: (e: any) => onChange(e.target.value),
                      onFocus,
                      onBlur,
                    }}
                  />
                );
              default:
                throw new Error('Unknown field type!');
            }
          }}
          onSavedSuccessfully={() => {
            successNotification('Wysłano wiadomość');
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
const RestorPassWithRouter = withRouter(RestorPass);
export default connect(mapStateToProps, mapDispatchToProps)(RestorPassWithRouter);
