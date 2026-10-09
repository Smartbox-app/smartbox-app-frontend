import React from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import { AddInvitedTenantReq } from 'smartbox-types';
import ApiService from '../../../services/api-service';

import { Spinner, Button, PageContent , Logo } from '../../../components/Branded';
import { formOnTranslateString } from '../../../utils/trans-form';
import { FormContainer, ButtonsContainer } from '../../../components/Layout';
import { history } from 'src/history';
import { __ } from '../../../helpers/i18n';
import { mapFieldsBig } from '../../../utils/fields-mapper';
import { useParams } from 'react-router';
import { useDispatch } from 'react-redux';
import { successNotification } from '../../../actions/notifications';
import { PageHeader } from '../../../components/ui';

const TenantActivation = () => {
  const loadUrl = 'user/form/add-invited-tenant';
  const sendUrl = 'user/add-invited-tenant';

  const dispatch = useDispatch();
  const { userId, updateToken } = useParams<{
    userId: string;
    updateToken: string;
  }>();

  const customSendFetcher = (formId: string, values: AddInvitedTenantReq) =>
    ApiService.sendForm(
      sendUrl,
      {
        ...values,
        userId,
        token: updateToken,
      },
      'POST',
    );

  const success = () => {
    dispatch(successNotification('notification.accountHasBeenActivated'));
    history.push('/');
  };

  const subButton = (
    <ButtonsContainer max>
      <Button text="application.send" type="submit" big primary rounded />
    </ButtonsContainer>
  );

  return (
    <PageContent>
      <div className="login-logo-wrapper">
        <Logo />
      </div>
      <FormContainer className="login-form">
        <PageHeader>{__('application.welcomeOnPlatform')}</PageHeader>
        <p>{__('application.setPasswordToActivateAccount')}</p>
        <ItfApiForm
          formId="UserActivationForm"
          schemaMayBeDynamic={false}
          schemaCacheEnabled={false}
          loadingInfo={<Spinner transparent />}
          schemaFetcher={() => ApiService.loadForm(loadUrl)}
          sendFetcher={customSendFetcher}
          submitButton={subButton}
          onSavedSuccessfully={success}
          onRenderFullField={mapFieldsBig}
          onTranslateString={formOnTranslateString}
        />
      </FormContainer>
    </PageContent>
  );
};

export default TenantActivation;
