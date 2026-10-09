import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Spinner } from 'src/components/Branded';
import {
  ButtonsContainer,
  FormContainer,
  Section,
} from 'src/components/Layout';
import {
  Button,
  CheckBox,
  Form,
  Header,
  Input,
  Stack,
} from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { ClassValidatorResolver } from 'src/resolvers/ClassValidatorResolver';
import { useTenantSmtpConfigQuery } from 'src/queries';
import {
  useUpdateTenantSmtpMutation,
  useTestTenantSmtpMutation,
} from 'src/mutations';
import { successNotification } from 'src/actions/notifications';
import { TenantSmtpConfigFormDto } from './dto/TenantSmtpConfigFormDto';
import type { UpdateTenantSmtpBody } from 'src/mutations/useUpdateTenantSmtpMutation';

interface Props {
  userId?: string;
}

const mapToPayload = (data: TenantSmtpConfigFormDto): UpdateTenantSmtpBody => {
  const body: UpdateTenantSmtpBody = {
    useCustomSmtp: data.useCustomSmtp,
    smtpHost: data.useCustomSmtp ? data.smtpHost.trim() || null : null,
    smtpPort: data.useCustomSmtp ? Number(data.smtpPort) || null : null,
    smtpUser: data.useCustomSmtp ? data.smtpUser?.trim() || null : null,
    smtpSecure: data.smtpSecure,
    smtpIgnoreTls: data.smtpIgnoreTls,
    smtpFromEmail: (data.smtpFromEmail ?? '').trim() || null,
  };
  if (data.smtpPassword?.trim()) {
    body.smtpPassword = data.smtpPassword.trim();
  }
  return body;
};

export const ManageTenantSmtp = ({ userId }: Props) => {
  const dispatch = useDispatch();
  const { data, isPending: loadingConfig } = useTenantSmtpConfigQuery(userId);
  const {
    mutate,
    isPending: saving,
    isSuccess,
  } = useUpdateTenantSmtpMutation(userId);
  const {
    mutate: sendTest,
    isPending: testing,
    isSuccess: isTestSuccess,
  } = useTestTenantSmtpMutation(userId);
  const [testRecipient, setTestRecipient] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<TenantSmtpConfigFormDto>({
    mode: 'onSubmit',
    resolver: ClassValidatorResolver(new TenantSmtpConfigFormDto()),
    defaultValues: {
      useCustomSmtp: false,
      smtpHost: '',
      smtpPort: 587,
      smtpUser: '',
      smtpPassword: '',
      smtpSecure: false,
      smtpIgnoreTls: false,
      smtpFromEmail: '',
    },
  });

  const useCustomSmtp = watch('useCustomSmtp');

  useEffect(() => {
    if (!data) return;
    reset({
      useCustomSmtp: data.useCustomSmtp,
      smtpHost: data.smtpHost ?? '',
      smtpPort: data.smtpPort ?? 587,
      smtpUser: data.smtpUser ?? '',
      smtpPassword: '',
      smtpSecure: data.smtpSecure,
      smtpIgnoreTls: data.smtpIgnoreTls,
      smtpFromEmail: data.smtpFromEmail ?? '',
    });
  }, [data, reset]);

  useEffect(() => {
    if (!isSuccess) return;
    dispatch(successNotification(__('application.tenantSmtpUpdated')));
  }, [isSuccess]);

  useEffect(() => {
    if (!isTestSuccess) return;
    dispatch(successNotification(__('application.tenantSmtpTestSent')));
  }, [isTestSuccess]);

  const onSubmit = (form: TenantSmtpConfigFormDto) => {
    const body = mapToPayload(form);
    mutate({ body });
  };

  const handleSendTest = () => {
    const to = testRecipient.trim();
    if (!to) return;
    sendTest({ body: { to } });
  };

  if (loadingConfig && !data) {
    return (
      <Section highlight>
        <Spinner transparent />
      </Section>
    );
  }

  return (
    <Section highlight>
      <Stack>
        <Header variant="h2">{__('application.tenantSmtpSection')}</Header>
        <FormContainer>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Stack>
              <CheckBox
                label={__('application.tenantSmtpUseCustom')}
                error={errors.useCustomSmtp?.message}
                {...register('useCustomSmtp')}
              />

              {useCustomSmtp ? (
                <>
                  <Input
                    label={__('application.tenantSmtpHost')}
                    placeholder="smtp.example.com"
                    error={errors.smtpHost?.message}
                    {...register('smtpHost')}
                  />
                  <Input
                    label={__('application.tenantSmtpPort')}
                    type="number"
                    error={errors.smtpPort?.message}
                    {...register('smtpPort', { valueAsNumber: true })}
                  />
                  <Input
                    label={__('application.tenantSmtpUser')}
                    error={errors.smtpUser?.message}
                    {...register('smtpUser')}
                  />
                  <Input
                    label={__('application.tenantSmtpPassword')}
                    type="password"
                    help={__('application.tenantSmtpPasswordHint')}
                    error={errors.smtpPassword?.message}
                    {...register('smtpPassword')}
                  />
                  <Input
                    label={__('application.tenantSmtpFromEmail')}
                    type="email"
                    error={errors.smtpFromEmail?.message}
                    {...register('smtpFromEmail')}
                  />
                  <CheckBox
                    label={__('application.tenantSmtpSecure')}
                    error={errors.smtpSecure?.message}
                    {...register('smtpSecure')}
                  />
                  <CheckBox
                    label={__('application.tenantSmtpIgnoreTls')}
                    error={errors.smtpIgnoreTls?.message}
                    {...register('smtpIgnoreTls')}
                  />
                </>
              ) : null}

              <ButtonsContainer>
                <Button
                  type="submit"
                  variant="primary"
                  text="application.save"
                  disabled={saving}
                />
              </ButtonsContainer>
            </Stack>
          </Form>

          <Stack>
            <Header variant="h3">
              {__('application.tenantSmtpTestSection')}
            </Header>
            <Stack>
              <Input
                label="application.tenantSmtpTestRecipient"
                type="email"
                name="tenant-smtp-test-to"
                value={testRecipient}
                autoComplete="off"
                onChange={async (e) => {
                  setTestRecipient(e.target.value);
                }}
                onBlur={async () => {}}
                ref={() => {}}
              />
            </Stack>
            <ButtonsContainer>
              <Button
                type="button"
                variant="secondary"
                text="application.tenantSmtpSendTest"
                disabled={testing || !testRecipient.trim()}
                onClick={handleSendTest}
              />
            </ButtonsContainer>
          </Stack>
        </FormContainer>
      </Stack>
    </Section>
  );
};
