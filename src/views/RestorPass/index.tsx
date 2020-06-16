import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ItfApiForm } from 'itf_formbuilder_react';
import { AuthLoginRequest, AuthLoginResult, UserRes } from 'smartbox-types';
import { Spinner, Input, LoginLogo } from '../../components/Common';
import { auth, notifications } from '../../actions';
import ApiService from '../../services/api-service';
import { store } from '../../App';
import { formOnTranslateString } from '../../utils/trans-form';
import { FormContainer, PageContent } from '../../components/Layout';
import { ApplicationState } from '../../reducers';

import ButtonsSection from './ButtonSection';

import './RestorPass.scss';

interface Props {
  successNotification: (text: string) => void;
}
const RestorPass = ({ successNotification }: Props) => (
  <PageContent>
    <LoginLogo />
    <FormContainer className="restor-pass-form">
      <ItfApiForm
        formId="loginForm"
        schemaMayBeDynamic={false}
        schemaCacheEnabled={false}
        loadingInfo={<Spinner transparent />}
        schemaFetcher={() => ApiService.loadForm('user/form/email')}
        sendFetcher={(formId: string, values: AuthLoginRequest) =>
          ApiService.sendForm('user/restor-pwd-petition', values, 'POST')
        }
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

export default connect(mapStateToProps, mapDispatchToProps)(RestorPass);
