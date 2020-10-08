import React from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ApiService from '../../services/api-service';
import { FormContainer, LogoContainer, PageContent } from '../../components/Layout';
import { Spinner, LoginLogo, Input } from '../../components/Common';
import { translateErrors } from '../../utils/errors-trans';
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
        onRenderFullField={(field, errors, fieldHtmlId, currentValue, onChange, onFocus, onBlur) => {
          switch (field.type) {
            case 'text':
              return (
                <Input
                  key={fieldHtmlId}
                  className="register-input"
                  type={field.options.type}
                  input={{
                    label: formOnTranslateString(field.title),
                    name: fieldHtmlId,
                    id: fieldHtmlId,
                    placeholder: formOnTranslateString(field.placeholder),
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
