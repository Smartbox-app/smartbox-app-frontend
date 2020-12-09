import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Redirect } from 'react-router-dom';
import { ItfApiForm } from 'itf_formbuilder_react';
import { UserRole, AuthLoginRequest, AuthLoginResult, UserRes } from 'smartbox-types';
import { Spinner, Input, Logo } from '../../../components/Common';
import { auth, notifications } from '../../../actions';
import ApiService from '../../../services/api-service';
import { translateErrors } from '../../../utils/errors-trans';
import { getRememberedRedirect, clearRememberedRedirect } from '../../../utils/remeber-redirect';
import { store } from '../../../App';
import { formOnTranslateString } from '../../../utils/trans-form';
import { FormContainer, PageContent } from '../../../components/Layout';
import { ApplicationState } from '../../../reducers';

import ButtonsSection from './ButtonSection';
import { __ } from '../../../helpers/i18n';

import './Login.scss';

interface Props {
  user: UserRes;
  loading: boolean;
  login: (userData: AuthLoginRequest) => void;
  saveUser: (userData: AuthLoginResult) => void;
  successNotification: (text: string) => void;
}

class Login extends React.Component<Props> {
  private getDefaultUserRedirect = (): React.ReactNode => {
    const { user } = this.props;
    switch (user!.role) {
      case UserRole.admin:
        return <Redirect to="/admin" />;
      case UserRole.user:
        return <Redirect to="/user" />;
      case UserRole.worker:
        return <Redirect to="/worker" />;
      default:
        return null;
    }
  };

  private getRedirect = () => {
    const { user } = this.props;
    const prohibited = ['/set-pass', '/restore-pass', '/404'];
    const redirect = getRememberedRedirect();
    if (redirect && redirect.role === user!.role) {
      clearRememberedRedirect();
      if (prohibited.includes(redirect.to) || redirect.to.indexOf('/order/step') > -1) {
        return this.getDefaultUserRedirect();
      }
      return this.getDefaultUserRedirect();
      // return <Redirect to={redirect.to} />;
    }

    return this.getDefaultUserRedirect();
  };

  render() {
    const { user, saveUser, successNotification, loading } = this.props;
    if (user) return this.getRedirect();
    if (loading) return <Spinner big />;
    return (
      <PageContent>
        <div className="login-logo-wrapper">
          <Logo />
        </div>
        <FormContainer className="login-form">
          <ItfApiForm
            formId="loginForm"
            schemaMayBeDynamic={false}
            schemaCacheEnabled={false}
            loadingInfo={<Spinner transparent />}
            schemaFetcher={() => ApiService.loadForm('auth/form/login')}
            sendFetcher={(formId: string, values: AuthLoginRequest) => ApiService.sendForm('auth/login', values)}
            submitButton={<ButtonsSection />}
            onRenderFullField={(field, errors, fieldHtmlId, currentValue, onChange, onFocus, onBlur) => {
              switch (field.type) {
                case 'text':
                  return (
                    <Input
                      key={fieldHtmlId}
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
                default:
                  throw new Error('Unknown field type!');
              }
            }}
            onSavedSuccessfully={(data: AuthLoginResult) => {
              successNotification(__('notification.logInSuccess'));
              store.dispatch(saveUser(data));
            }}
            onTranslateString={formOnTranslateString}
          />
        </FormContainer>
      </PageContent>
    );
  }
}

const mapStateToProps = (state: ApplicationState): any => ({
  user: state.user.details,
  loading: state.spinner.loading,
});

const mapDispatchToProps = (dispatch: any): any => bindActionCreators({ ...auth, ...notifications }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Login);
