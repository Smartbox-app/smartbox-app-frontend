import { ItfApiForm } from 'itf_formbuilder_react';
import  { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import styled from 'styled-components';

import { ActivationStatusRes } from 'smartbox-types';
import { notifications } from 'src/actions';
import { Spinner, Logo } from 'src/components/Branded';
import { ButtonsContainer, FormContainer } from 'src/components/Layout';
import {
  Header,
  Section,
  Stack,
  Button,
  Typography
} from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { history } from 'src/history';
import { useEmailVerificationMutation } from 'src/mutations';
import ApiService from 'src/services/api-service';
import { mapFields } from 'src/utils/fields-mapper';
import { formOnTranslateString } from 'src/utils/trans-form';

type PageState = 'loading' | 'activating' | 'needsPassword' | 'error';

const StyledContent = styled('div')({
  maxWidth: 600,
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  gap: 24,
});

const EmailConfirm = () => {
  const dispatch = useDispatch();
  const { mutate: verifyEmail } = useEmailVerificationMutation();
  const { userId, updateToken } = useParams<{
    userId: string;
    updateToken: string;
  }>();
  const [pageState, setPageState] = useState<PageState>('loading');

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const status = await ApiService.callFetch<ActivationStatusRes>(
          'GET',
          `user/activation-status/${userId}/${updateToken}`,
          undefined,
          undefined,
          undefined,
          true,
          true,
        );

        if (cancelled) return;

        if (status?.needsPassword) {
          setPageState('needsPassword');
          return;
        }

        setPageState('activating');
        verifyEmail({ userId, updateToken });
      } catch {
        if (!cancelled) {
          setPageState('error');
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [userId, updateToken, verifyEmail]);

  const customSendFetcher = (
    _formId: string,
    values: { pwd: string; pwd2: string },
  ) =>
    ApiService.sendForm(
      `user/active/${userId}/${updateToken}`,
      {
        ...values,
        userId,
        token: updateToken,
      },
      'POST',
    );

  const onPasswordSaved = () => {
    dispatch(
      notifications.successNotification(
        'notification.accountHasBeenActivated',
      ),
    );
    history.push('/login');
  };

  if (pageState === 'needsPassword') {
    return (
      <StyledContent>
        <Logo width="medium" />
        <Section variant="bordered">
          <Header variant="h2">{__('application.thanksForRegister')}</Header>
          <Typography>{__('application.setPasswordToActivateAccount')}</Typography>
          <ItfApiForm
            formId="ActivateUserForm"
            schemaMayBeDynamic={false}
            schemaCacheEnabled={false}
            loadingInfo={<Spinner transparent />}
            schemaFetcher={() => ApiService.loadForm('user/form/activate-user')}
            sendFetcher={customSendFetcher}
            submitButton={
              <ButtonsContainer center>
                <Button
                  text="application.activateAccount"
                  type="submit"
                  size="large"
                />
              </ButtonsContainer>
            }
            onSavedSuccessfully={onPasswordSaved}
            onRenderFullField={mapFields}
            onTranslateString={formOnTranslateString}
          />
        </Section>
      </StyledContent>
    );
  }

  return (
    <StyledContent>
      <Logo width="medium" />
      <Section variant="transparent">
        <Header variant="h2">{__('application.thanksForRegister')}</Header>
        <Typography>
          {__(
            pageState === 'error'
              ? 'application.mailVerificationFailed'
              : 'application.mailVerificationInProgress',
          )}
        </Typography>
        {pageState !== 'error' && (
          <FormContainer fullWidth>
            <Stack>
              <Section variant="transparent" align="center">
                <Spinner />
              </Section>
            </Stack>
          </FormContainer>
        )}
      </Section>
    </StyledContent>
  );
};

export default EmailConfirm;
