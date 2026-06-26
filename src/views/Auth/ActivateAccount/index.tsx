import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router';
import { useDispatch } from 'react-redux';
import { ClassValidatorResolver } from 'src/resolvers/ClassValidatorResolver';
import { ActivateAccountCodeDto } from 'src/dto/ActivateAccountCodeDto';
import {
  useActivateUserByCodeMutation,
  useResendActivationMutation,
} from 'src/mutations';
import { useTenant } from 'src/hooks/useTenant';
import { isSmsAccountConfirmation } from 'src/utils/account-confirmation';
import {
  buildActivateAccountPath,
  getActivationTokenFromSearch,
} from 'src/utils/activate-account-url';
import { history } from 'src/history';
import { notifications } from 'src/actions';
import { Logo } from 'src/components/Branded';
import { FormContainer } from 'src/components/Layout';
import {
  Button,
  Form,
  Header,
  InfoContent,
  Input,
  Section,
  Stack,
  Typography,
} from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { Link } from 'react-router-dom';

const ActivateAccount = () => {
  const dispatch = useDispatch();
  const { tenant } = useTenant();
  const location = useLocation();
  const activationToken = getActivationTokenFromSearch(location.search) ?? '';

  const { mutate: activate, isPending: activating } =
    useActivateUserByCodeMutation();
  const { mutate: resend, isPending: resending } =
    useResendActivationMutation();

  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = useForm<ActivateAccountCodeDto>({
    mode: 'onSubmit',
    resolver: ClassValidatorResolver(new ActivateAccountCodeDto()),
    defaultValues: { code: '' },
  });

  useEffect(() => {
    if (!tenant) return;
    if (!isSmsAccountConfirmation(tenant)) {
      history.replace('/resend-activation-link');
      return;
    }
    if (!activationToken) {
      history.replace('/login');
    }
  }, [tenant, activationToken]);

  const onSubmit = (data: ActivateAccountCodeDto) => {
    if (!isValid || !activationToken) return;
    activate(
      { activationToken, code: data.code },
      {
        onSuccess: () => {
          dispatch(
            notifications.successNotification(
              'notification.accountHasBeenActivated',
            ),
          );
          history.push('/login');
        },
      },
    );
  };

  const onResend = () => {
    if (!activationToken) return;
    resend(activationToken, {
      onSuccess: (result) => {
        const nextToken = result?.activationToken ?? activationToken;
        if (result?.activationToken && nextToken !== activationToken) {
          history.replace(buildActivateAccountPath(nextToken));
        }
        if (!result) return;
        dispatch(
          notifications.successNotification(
            __('application.activationSmsCodeSent'),
          ),
        );
      },
    });
  };

  if (!tenant || !isSmsAccountConfirmation(tenant) || !activationToken) {
    return null;
  }

  return (
    <InfoContent>
      <Logo width="medium" />
      <Header variant="h2">{__('application.activateAccountBySms')}</Header>
      <Typography>{__('application.activateAccountBySmsHint')}</Typography>
      <FormContainer>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Stack>
            <Section>
              <Input
                label="application.activationCode"
                placeholder="application.activationCodePlaceholder"
                error={errors.code?.message}
                required
                autoComplete="one-time-code"
                {...register('code')}
              />
            </Section>
            <Section variant="transparent" align="center">
              <Button
                text="application.activateAccount"
                type="submit"
                size="large"
                disabled={activating}
              />
              <Button
                text="application.resendActivationSms"
                type="button"
                variant="secondary"
                size="large"
                disabled={resending}
                onClick={onResend}
              />
              <Typography>
                <Link to="/login">{__('application.back')}</Link>
              </Typography>
            </Section>
          </Stack>
        </Form>
      </FormContainer>
    </InfoContent>
  );
};

export default ActivateAccount;