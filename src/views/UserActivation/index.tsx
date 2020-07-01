import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { ItfApiForm } from 'itf_formbuilder_react';
import { notifications, auth } from '../../actions';
import ApiService from '../../services/api-service';

import { Spinner, Button, Logo } from '../../components/Common';
import { formOnTranslateString } from '../../utils/trans-form';
import { FormContainer, ButtonsContainer, PageContent } from '../../components/Layout';
import { history } from '../../App';

interface Props {
  match: any;
  logout: () => void;
  successNotification: (text: string) => void;
}

const UserActivation = ({ successNotification, match, logout }: Props) => {
  const loadUrl = 'user/form/add-invited-user';
  const sendUrl = 'user/add-invited';

  const customSendFetcher = (formId: string, values: any) =>
    ApiService.sendForm(
      sendUrl,
      {
        ...values,
        invitationId: match.params.invitationId,
        updateToken: match.params.updateToken,
      },
      'POST',
    );

  const success = () => {
    successNotification('Konto zostało aktywowane.');
    logout();
    history.push('/');
  };

  const subButton = (
    <ButtonsContainer max>
      <Button text="Wyślij" type="submit" big primary rounded />
    </ButtonsContainer>
  );

  return (
    <PageContent>
      <div className="login-logo-wrapper">
        <Logo />
      </div>
      <FormContainer className="login-form">
        <ItfApiForm
          formId="UuerActivationForm"
          schemaMayBeDynamic={false}
          schemaCacheEnabled={false}
          loadingInfo={<Spinner transparent />}
          schemaFetcher={() => ApiService.loadForm(loadUrl)}
          sendFetcher={customSendFetcher}
          submitButton={subButton}
          onSavedSuccessfully={success}
          onTranslateString={formOnTranslateString}
        />
      </FormContainer>
    </PageContent>
  );
};

const mapDispatchToProps = (dispatch: any): any =>
  bindActionCreators(
    {
      ...notifications,
      ...auth,
    },
    dispatch,
  );

export default connect(null, mapDispatchToProps)(UserActivation);
