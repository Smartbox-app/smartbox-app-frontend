import { ItfApiForm } from 'itf_formbuilder_react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { notifications } from 'src/actions';
import { Spinner, Logo } from 'src/components/Branded';
import { FormContainer } from 'src/components/Layout';
import { Header, InfoContent } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { history } from 'src/history';
import { useTenant } from 'src/hooks/useTenant';
import ApiService from 'src/services/api-service';
import { isSmsAccountConfirmation } from 'src/utils/account-confirmation';
import { mapFieldsBig } from 'src/utils/fields-mapper';
import { formOnTranslateString } from 'src/utils/trans-form';
import { ButtonsSection } from 'src/views/Auth/ResendActivationLink/ButtonsSection';

const ResendActivationLink = () => {
  const dispatch = useDispatch();
  const { tenant } = useTenant();

  const loadUrl = 'user/form/email';
  const sendUrl = 'user/resend-activation-email';
  const METHOD = 'POST';

  useEffect(() => {
    if (tenant && isSmsAccountConfirmation(tenant)) {
      history.replace('/activate-account');
    }
  }, [tenant]);

  if (!tenant || isSmsAccountConfirmation(tenant)) return null;

  return (
    <InfoContent>
      <Logo width="medium" />
      <Header variant="h2">{__('application.noActivationEmail')}</Header>
      <FormContainer>
        <ItfApiForm
          formId="loginForm"
          schemaMayBeDynamic={false}
          schemaCacheEnabled={false}
          loadingInfo={<Spinner transparent />}
          schemaFetcher={() => ApiService.loadForm(loadUrl)}
          sendFetcher={(formId: string, values) =>
            ApiService.sendForm(sendUrl, values, METHOD)
          }
          submitButton={<ButtonsSection />}
          onRenderFullField={mapFieldsBig}
          onSavedSuccessfully={() => {
            dispatch(
              notifications.successNotification(
                __('application.activationLinkSent'),
              ),
            );
            history.push('/');
          }}
          onTranslateString={formOnTranslateString}
        />
      </FormContainer>
    </InfoContent>
  );
};

export default ResendActivationLink;