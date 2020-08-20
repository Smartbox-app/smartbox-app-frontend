import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { ItfApiForm } from 'itf_formbuilder_react';
import { AddInvitedUserReq, UserRole } from 'smartbox-types';
import { notifications, auth } from '../../actions';
import { ApplicationState } from '../../reducers';
import ApiService from '../../services/api-service';

import { Spinner, Button, Logo } from '../../components/Common';
import { formOnTranslateString } from '../../utils/trans-form';
import { FormContainer, ButtonsContainer, PageContent } from '../../components/Layout';
import { history } from '../../App';

interface Props {
  match: any;
  userRole: UserRole;
  logout: () => void;
  successNotification: (text: string) => void;
}

const UserActivation = ({ successNotification, match, logout, userRole }: Props) => {
  const loadUrl = 'user/form/add-invited-user';
  const sendUrl = 'user/add-invited';

  const customSendFetcher = (formId: string, values: AddInvitedUserReq) =>
    ApiService.sendForm(
      sendUrl,
      {
        ...values,
        invitationId: match.params.invitationId,
        token: match.params.updateToken,
      },
      'POST',
    );

  const success = () => {
    successNotification('Konto zostało aktywowane.');
    userRole && logout();
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
          formId="UserActivationForm"
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

const mapStateToProps = (state: ApplicationState) => ({
  userRole: state.user.details.role,
});

const mapDispatchToProps = (dispatch: any): any =>
  bindActionCreators(
    {
      ...notifications,
      ...auth,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(UserActivation);
