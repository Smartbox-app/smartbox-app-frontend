import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Redirect } from 'react-router-dom';
import { ItfApiForm } from 'itf_formbuilder_react';
import { UserRole, AuthLoginRequest, AuthLoginResult, UserRes } from 'smartbox-types';
import { Input } from '../../../components/Common';
import { Logo, Spinner, PageContent } from '../../../components/Branded';
import { auth, notifications } from '../../../actions';
import ApiService from '../../../services/api-service';
import { getRememberedRedirect, clearRememberedRedirect } from '../../../utils/remeber-redirect';
import { store } from '../../../App';
import { formOnTranslateString } from '../../../utils/trans-form';
import { FormContainer } from '../../../components/Layout';
import { ApplicationState } from '../../../reducers';
import { mapFieldsBig } from '../../../utils/fields-mapper';

import ButtonsSection from './ButtonSection';

import './Login.scss';
import { AppVersion } from '../../../components/AppVersion';


interface Props {
  user: UserRes | null;
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
      case UserRole.client:
        return <Redirect to="/client" />;
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
    const version = localStorage.getItem('v');
    if (user) return this.getRedirect();
    if (loading) return <Spinner />;
    return (
      <>
        <PageContent bg>
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
              onRenderFullField={mapFieldsBig}
              onSavedSuccessfully={(data: AuthLoginResult) => {
                successNotification('notification.logInSuccess');
                store.dispatch(saveUser(data));
              }}
              onTranslateString={formOnTranslateString}
            />
          </FormContainer>
          <AppVersion />
        </PageContent>

      </>
    );
  }
}

const mapStateToProps = (state: ApplicationState): any => ({
  user: state.user.details,
  loading: state.spinner.loading,
});

const mapDispatchToProps = (dispatch: any): any => bindActionCreators({ ...auth, ...notifications }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Login);
