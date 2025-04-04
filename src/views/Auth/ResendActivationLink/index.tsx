import { useDispatch } from 'react-redux';
import { ItfApiForm } from 'itf_formbuilder_react';
import { LoginLogo } from '../../../components/Common';
import { Spinner, PageContent } from '../../../components/Branded';
import { notifications } from '../../../actions';
import ApiService from '../../../services/api-service';
import { formOnTranslateString } from '../../../utils/trans-form';
import { FormContainer } from '../../../components/Layout';
import { __ } from '../../../helpers/i18n';
import { history } from '../../../App';

// import './RestorePass.scss';
import { mapFieldsBig } from '../../../utils/fields-mapper';
import { ButtonsSection } from './ButtonsSection';
import { PageHeader } from '../../../components/ui';

export const ResendActivationLink = () => {
  const dispatch = useDispatch();

  const loadUrl = 'user/form/email';
  const sendUrl = 'user/resend-activation-email';
  const METHOD = 'POST';

  return (
    <PageContent>
      <LoginLogo />
      <FormContainer className="restore-pass-form">
        <PageHeader>{__('application.noActivationEmail')}</PageHeader>
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
    </PageContent>
  );
};
