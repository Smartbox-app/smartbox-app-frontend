import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ItfApiForm } from 'itf_formbuilder_react';
import { Spinner, Logo } from '../../../components/Branded';
import { notifications } from '../../../actions';
import ApiService from '../../../services/api-service';
import { formOnTranslateString } from '../../../utils/trans-form';
import { FormContainer } from '../../../components/Layout';
import { __ } from '../../../helpers/i18n';
import { history } from 'src/history';

import { mapFieldsBig } from '../../../utils/fields-mapper';
import { ButtonsSection } from './ButtonsSection';
import { Header, InfoContent } from '../../../components/ui';
import { useTenant } from 'src/hooks/useTenant';
import { isSmsAccountConfirmation } from 'src/utils/account-confirmation';

export default ResendActivationLink = () => {
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
