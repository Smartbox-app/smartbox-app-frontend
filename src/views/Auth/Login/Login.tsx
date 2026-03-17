import { useForm } from 'react-hook-form';
import { useLoginMutation } from '../../../mutations/useLoginMutation';
import { LoginDto } from '../../../dto/LoginDto';
import { ClassValidatorResolver } from '../../../resolvers/ClassValidatorResolver';
import { Input } from '../../../components/ui/Input';
import {
  Link,
  Narrow,
  Section,
  Typography,
  Button,
  Form,
} from '../../../components/ui';
import { Logo, PageContent } from '../../../components/Branded';
import { Stack } from '../../../components/ui/Stack';
import { __ } from '../../../helpers/i18n';
import { useTenant } from '../../../hooks/useTenant';
import { FbButton } from './components/FbButton';
import { AppVersion } from '../../../components/AppVersion';
import { GoogleButton } from './components/GoogleButton';
import { Capacitor } from '@capacitor/core';
import { Device } from '@capacitor/device';
import { useEffect, useState } from 'react';

export const Login = () => {
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
    if (!isValid) return;
    login({
      ...data,
      email: data.email.trim(),
    });
  };

  if (!tenant) return null;

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
                to={tenant.slides.length > 0 ? '/welcome' : 'register'}
              />
              {/* )} */}
            </Section>
          </Form>
          <Section align="center">
            <Typography>
              {__('application.forgotPass')}{' '}
              <Link to="/restore-pass">{__('application.clickHere')}</Link>
            </Typography>

            <Typography>
              <Link to="/resend-activation-link">
                {__('application.noActivationEmail')}
              </Link>
            </Typography>
            <AppVersion variant="secondary" />
          </Section>
        </Stack>
      </Narrow>
    </PageContent>
  );
};
