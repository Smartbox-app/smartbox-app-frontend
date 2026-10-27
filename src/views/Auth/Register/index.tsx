import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { modal, notifications } from 'src/actions';
import { PageContent, Logo } from 'src/components/Branded';
import { ButtonsContainer } from 'src/components/Layout';
import {
  Button,
  CheckBox,
  Form,
  Input,
  Link,
  PageHeader,
  Section,
  Stack,
  Typography,
} from 'src/components/ui';
import { RegisterDto } from 'src/dto/RegisterDto';
import { __ } from 'src/helpers/i18n';
import { history } from 'src/history';
import { useTenant } from 'src/hooks/useTenant';
import { useTracking } from 'src/hooks/useTracking';
import { useRegisterMutation } from 'src/mutations';
import { ClassValidatorResolver } from 'src/resolvers/ClassValidatorResolver';
import { isSmsAccountConfirmation } from 'src/utils/account-confirmation';
import { buildActivateAccountPath } from 'src/utils/activate-account-url';
import { AccountRegisteredModal } from 'src/views/Auth/Register/AccountRegisteredModal';

const RegisterForm = styled('div')(({ theme }) => ({
  width: '100%',
  display: 'flex',
  gap: theme.spacing * 4,
  flexWrap: 'wrap',

  '@media(min-width: 768px)': {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
  },
}));

const LogoContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
});

const Register = () => {
  const { tenant } = useTenant();
  const { trackCompleteRegistration } = useTracking();
  const dispatch = useDispatch();
  const {
    mutate: registerUser,
    isPending,
    data,
    isSuccess,
    variables,
  } = useRegisterMutation();

  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = useForm<RegisterDto>({
    mode: 'onSubmit',
    resolver: ClassValidatorResolver(new RegisterDto()),
  });

  const onSubmit = (data: RegisterDto) => {
    if (!isValid) return;
    registerUser({
      ...data,
      email: data.email.trim(),
      phone: data.phone.trim(),
    });
  };

  useEffect(() => {
    if (!data || !isSuccess || !tenant) return;

    const smsActivation = isSmsAccountConfirmation(tenant);

    trackCompleteRegistration(variables?.email);

    dispatch(
      notifications.successNotification('notification.accountRegistered'),
    );

    if (smsActivation && data.activationToken) {
      history.push(buildActivateAccountPath(data.activationToken));
      return;
    }

    dispatch(modal.showModal(<AccountRegisteredModal />));
    history.push('/');
  }, [data, isSuccess, tenant, variables?.email, dispatch, trackCompleteRegistration]);

  if (!tenant) return null;

  return (
    <PageContent>
      <LogoContainer>
        <Logo />
      </LogoContainer>
      <Stack>
        <PageHeader>{__('application.registration')}</PageHeader>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Stack>
            <Section>
              <RegisterForm>
                <Input
                  label="auth.email"
                  placeholder="auth.email_placeholder"
                  error={errors['email']?.message}
                  required
                  {...register('email')}
                />
                <Input
                  label="auth.phone"
                  placeholder="auth.phone_placeholder"
                  error={errors['phone']?.message}
                  required
                  help="auth.phone_help"
                  {...register('phone')}
                />
                <Input
                  label="auth.first_name"
                  placeholder="auth.first_name_placeholder"
                  error={errors['firstName']?.message}
                  required
                  {...register('firstName')}
                />
                <Input
                  label="auth.last_name"
                  placeholder="auth.last_name_placeholder"
                  error={errors['lastName']?.message}
                  required
                  {...register('lastName')}
                />
                <Input
                  label="auth.password"
                  type="password"
                  placeholder="auth.password_placeholder"
                  error={errors['pwd']?.message}
                  required
                  {...register('pwd')}
                />
                <Input
                  label="auth.password_confirmation"
                  type="password"
                  placeholder="auth.password_placeholder"
                  error={errors['pwd2']?.message}
                  required
                  {...register('pwd2')}
                />
              </RegisterForm>
            </Section>
            <Section>
              <CheckBox
                {...register('rules')}
                required
                label={
                  <Typography>
                    {__('application.readTheProvisions')}{' '}
                    <Link target="_blank" href="/rules" rel="noreferrer">
                      <u>{__('application.statutes')}</u>
                    </Link>{' '}
                    {__('application.and')}{' '}
                    <Link
                      target="_blank"
                      href="/privacy-policy"
                      rel="noreferrer"
                    >
                      <u>{__('application.privacyPolices')}</u>
                    </Link>{' '}
                    {__('application.acceptContent')}
                  </Typography>
                }
                error={errors.rules?.message}
              />
            </Section>
            <Section variant="transparent">
              <ButtonsContainer center>
                <Button
                  disabled={isPending}
                  size="large"
                  variant="primary"
                  type="submit"
                  text="application.send"
                />
              </ButtonsContainer>
            </Section>
          </Stack>
        </Form>
      </Stack>
    </PageContent>
  );
};

export default Register;
