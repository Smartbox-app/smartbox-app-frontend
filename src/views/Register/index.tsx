import React from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ApiService from '../../services/api-service';
import { FormContainer, LogoContainer, PageContent } from '../../components/Layout';
import { Spinner, LoginLogo, Input } from '../../components/Common';
import { formOnTranslateString } from '../../utils/trans-form';
import { notifications } from '../../actions';
import { history } from '../../App';

import ButtonSection from './ButtonSection';

import './Register.scss';
import { __ } from '../../helpers/i18n';

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
        onSavedSuccessfully={() => {
          successNotification(__('notification.accountRegistered'));
          history.push('/');
        }}
        onTranslateString={formOnTranslateString}
      />
    </FormContainer>
  </PageContent>
);

const mapDispatchToProps = (dispatch: any): any =>
  bindActionCreators({ successNotification: notifications.successNotification }, dispatch);

export default connect(null, mapDispatchToProps)(Register);
