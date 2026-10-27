import { ItfApiForm } from 'itf_formbuilder_react';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';

import { AddInvitedTenantReq } from 'smartbox-types';
import { successNotification } from 'src/actions/notifications';
import { Spinner, Button, PageContent , Logo } from 'src/components/Branded';
import { FormContainer, ButtonsContainer } from 'src/components/Layout';
import { PageHeader } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { history } from 'src/history';
import ApiService from 'src/services/api-service';
import { mapFieldsBig } from 'src/utils/fields-mapper';
import { formOnTranslateString } from 'src/utils/trans-form';

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
