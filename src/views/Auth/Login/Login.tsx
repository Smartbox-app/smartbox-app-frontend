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

export const Login = () => {
  const { tenant } = useTenant();

  const { mutate: login, isPending } = useLoginMutation();

  const { handleSubmit, register } = useForm<LoginDto>({
    mode: 'onSubmit',
    resolver: ClassValidatorResolver(new LoginDto()),
  });

  const onSubmit = (data: LoginDto) => {
    console.log('data', data);
    login(data);
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
                {...register('email')}
              />
              <Input
                label="auth.password"
                type="password"
                placeholder="auth.password_placeholder"
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
              <FbButton />
              {/* <GoogleButton /> */}
              {tenant.rules && tenant.privacy && (
                <Button
                  text="application.register"
                  size="large"
                  to={tenant.slides.length > 0 ? '/welcome' : 'register'}
                />
              )}
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
