import React from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ApiService from '../../services/api-service';
import { FormContainer, ButtonsContainer, LogoContainer, PageContent } from '../../components/Layout';
import { Spinner, Button } from '../../components/Common';
import { formOnTranslateString } from '../../utils/trans-form';
import { notifications } from '../../actions';
import { history } from '../../App';

import './Register.scss';

interface Props {
  successNotification: (text: string) => void;
  match: any;
}

const Register = ({ successNotification }: Props) => {
  console.log('register');
  const subButton = (
    <ButtonsContainer max>
      <Button text="Wyślij" type="submit" big primary rounded />
      <Button text="Wróć" to="/" big rounded />
    </ButtonsContainer>
  );
  return (
    <PageContent>
      <LogoContainer />
      <FormContainer className="register-form">
        <ItfApiForm
          formId="UuerActivationForm"
          schemaMayBeDynamic={false}
          schemaCacheEnabled={false}
          loadingInfo={<Spinner transparent />}
          schemaFetcher={() => ApiService.loadForm('user/form/add-user')}
          sendFetcher={(formId: string, values: any) => ApiService.sendForm('user/new', values, 'POST')}
          submitButton={subButton}
          onSavedSuccessfully={() => {
            successNotification('Konto zostało zarejestrowane.');
            history.push('/');
          }}
          onTranslateString={formOnTranslateString}
        />
      </FormContainer>
    </PageContent>
  );
};

const mapDispatchToProps = (dispatch: any): any =>
  bindActionCreators({ successNotification: notifications.successNotification }, dispatch);

export default connect(null, mapDispatchToProps)(Register);
