import React, { useEffect } from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import { bindActionCreators } from 'redux';
import { connect, useDispatch, useSelector } from 'react-redux';
import ApiService from '../../../services/api-service';
import { ButtonsContainer, FormContainer } from '../../../components/Layout';
import { LoginLogo } from '../../../components/Common';
import { Spinner, PageContent, Logo } from '../../../components/Branded';
import { formOnTranslateString } from '../../../utils/trans-form';
import { modal, notifications } from '../../../actions';
import { history } from '../../../App';
import { __ } from '../../../helpers/i18n';

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
import { useTenant } from 'src/hooks/useTenant';
import { useRegisterMutation } from 'src/mutations';
import { RegisterDto } from 'src/dto/RegisterDto';
import { useForm } from 'react-hook-form';
import { ClassValidatorResolver } from 'src/resolvers/ClassValidatorResolver';
import styled from 'styled-components';
import { AccountRegisteredModal } from './AccountRegisteredModal';

const RegisterForm = styled('div')(({ theme }) => ({
  width: '100%',
  display: 'flex',
  gap: theme.spacing * 4,

  '@media(min-width: 500px)': {
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
  const dispatch = useDispatch();
  const {
    mutate: registerUser,
    isPending,
    data,
    isSuccess,
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
    registerUser(data);
  };

  useEffect(() => {
    console.log('test1', data, isSuccess);
    if (!data || !isSuccess) return;
    dispatch(modal.showModal(<AccountRegisteredModal />));
    dispatch(
      notifications.successNotification('notification.accountRegistered'),
    );
    history.push('/');
  }, [data, isSuccess]);

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
                  {...register('email')}
                />
                <Input
                  label="auth.phone"
                  placeholder="auth.phone_placeholder"
                  error={errors['phone']?.message}
                  {...register('phone')}
                />
                <Input
                  label="auth.first_name"
                  placeholder="auth.first_name_placeholder"
                  error={errors['firstName']?.message}
                  {...register('firstName')}
                />
                <Input
                  label="auth.last_name"
                  placeholder="auth.last_name_placeholder"
                  error={errors['lastName']?.message}
                  {...register('lastName')}
                />
                <Input
                  label="auth.password"
                  type="password"
                  placeholder="auth.password_placeholder"
                  error={errors['pwd']?.message}
                  {...register('pwd')}
                />
                <Input
                  label="auth.password_confirmation"
                  type="password"
                  placeholder="auth.password_placeholder"
                  error={errors['pwd2']?.message}
                  {...register('pwd2')}
                />
              </RegisterForm>
            </Section>
            <Section>
              <CheckBox
                {...register('rules')}
                label={
                  <Typography>
                    {__('application.readTheProvisions')}{' '}
                    <Link
                      target="_blank"
                      href={`${ApiService.url}tenant/rules/${tenant.id}`}
                      rel="noreferrer"
                    >
                      <u>{__('application.statutes')}</u>
                    </Link>{' '}
                    i{' '}
                    <Link
                      target="_blank"
                      href={`${ApiService.url}tenant/privacy/${tenant.id}`}
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

const mapDispatchToProps = (dispatch: any): any =>
  bindActionCreators(
    { successNotification: notifications.successNotification },
    dispatch,
  );

export default connect(null, mapDispatchToProps)(Register);
