import { Capacitor } from '@capacitor/core';
import { Device } from '@capacitor/device';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import {
  AccountActivationTokenPayload,
  ApiErrorCode,
} from 'smartbox-types';
import { notifications } from 'src/actions';
import { AppVersion } from 'src/components/AppVersion';
import { Logo, PageContent } from 'src/components/Branded';
import {
  Narrow,
  Section,
  Typography,
  Button,
  Form,
} from 'src/components/ui';
import { Input } from 'src/components/ui/Input';
import { Stack } from 'src/components/ui/Stack';
import { LoginDto } from 'src/dto/LoginDto';
import { __ } from 'src/helpers/i18n';
import { history } from 'src/history';
import { useTenant } from 'src/hooks/useTenant';
import {
  LoginMutationError,
  useLoginMutation,
} from 'src/mutations/useLoginMutation';
import { ClassValidatorResolver } from 'src/resolvers/ClassValidatorResolver';
import { isSmsAccountConfirmation } from 'src/utils/account-confirmation';
import { buildActivateAccountPath } from 'src/utils/activate-account-url';
import { withAttributionSearch } from 'src/utils/attribution-params';
import { FbButton } from 'src/views/Auth/Login/components/FbButton';
import { GoogleButton } from 'src/views/Auth/Login/components/GoogleButton';
import { MobileAppLinks } from 'src/views/Auth/Login/components/MobileAppLinks';

export const Login = () => {
  const dispatch = useDispatch();
  const { tenant } = useTenant();
  const [buttonsAvailable, setButtonsAvailable] = useState(false);

  const { mutate: login, isPending } = useLoginMutation();

  const isIosNativeBuild = async () => {
    if (!Capacitor.isNativePlatform()) return false;

    const { platform } = await Device.getInfo();
    return platform === 'ios';
  };

  const verifyThirdPartyLogInAvailability = async () => {
    const isIos = await isIosNativeBuild();
    if (isIos) {
      setButtonsAvailable(false);

      return;
    }

    setButtonsAvailable(true);
  };

  useEffect(() => {
    verifyThirdPartyLogInAvailability();
  }, []);

  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = useForm<LoginDto>({
    mode: 'onSubmit',
    resolver: ClassValidatorResolver(new LoginDto()),
  });

  const onSubmit = (data: LoginDto) => {
    if (!isValid || !tenant) return;
    const email = data.email.trim();
    const smsActivation = isSmsAccountConfirmation(tenant);

    login(
      { ...data, email },
      {
        onError: (error) => {
          if (
            error instanceof LoginMutationError &&
            error.errorCode === ApiErrorCode.FirstActiveUser &&
            smsActivation
          ) {
            const payload = error.payload as
              | AccountActivationTokenPayload
              | undefined;
            if (payload?.activationToken) {
              history.push(buildActivateAccountPath(payload.activationToken));
            }
            return;
          }

          if (error instanceof LoginMutationError) {
            dispatch(notifications.errorNotification(error.errorCode));
          }
        },
      },
    );
  };

  if (!tenant) return null;

  const smsActivation = isSmsAccountConfirmation(tenant);

  return (
    <PageContent bg>
      <Narrow>
        <Logo />
        <Stack>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Section>
              <Input
                label="auth.email"
                placeholder="auth.email_placeholder"
                error={errors['email']?.message}
                {...register('email')}
              />
              <Input
                label="auth.password"
                type="password"
                placeholder="auth.password_placeholder"
                error={errors['pwd']?.message}
                {...register('pwd')}
              />
            </Section>

            <Section variant="transparent" align="center">
              <Button
                text="application.login"
                size="large"
                type="submit"
                disabled={isPending}
              />
              {buttonsAvailable ? (
                <>
                  <FbButton />
                  <GoogleButton />
                </>
              ) : null}
              {/* <GoogleButton /> */}
              {/* {tenant.rules && tenant.privacy && ( */}
              <Button
                variant="secondary"
                text="application.register"
                size="large"
                to={withAttributionSearch(
                  tenant.slides.length > 0 ? '/welcome' : '/register',
                )}
              />
              {/* )} */}
            </Section>
          </Form>
          <MobileAppLinks tenant={tenant} />
          <Section align="center">
            <Typography>
              {__('application.forgotPass')}{' '}
              <Link to={withAttributionSearch('/restore-pass')}>
                {__('application.clickHere')}
              </Link>
            </Typography>

            {!smsActivation ? (
              <Typography>
                <Link to={withAttributionSearch('/resend-activation-link')}>
                  {__('application.noActivationEmail')}
                </Link>
              </Typography>
            ) : null}
            <AppVersion variant="secondary" />
          </Section>
        </Stack>
      </Narrow>
    </PageContent>
  );
};
