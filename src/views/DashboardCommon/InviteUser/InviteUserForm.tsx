import React, { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import { Language, UserRole, UserRoleForTenant } from 'smartbox-types';
import { showModal } from 'src/actions/modal';
import { successNotification } from 'src/actions/notifications';
import { Spinner } from 'src/components/Branded';
import { InputSelect } from 'src/components/Common';
import { ButtonsContainer, FormContainer } from 'src/components/Layout';
import { Form, Button } from 'src/components/ui';
import { InviteUserFormDto } from 'src/dto/InviteUserFormDto';
import { __ } from 'src/helpers/i18n';
import { history } from 'src/history';
import { useInviteUsersMutation } from 'src/mutations';
import {
  useGetTenantOptionsQuery,
  useGetInviteStockOptionsQuery,
  useGetMyDetailsQuery,
} from 'src/queries';
import { ClassValidatorResolver } from 'src/resolvers/ClassValidatorResolver';
import UserService from 'src/services/user-service';

import { InviteEmailsField } from './InviteEmailsField';
import { InviteUsersSuccessModal } from './InviteUsersSuccessModal';

const LANGUAGE_OPTIONS = [
  { value: Language.pl, label: 'Polski' },
  { value: Language.cz, label: 'Čeština' },
  { value: Language.ua, label: 'Українська' },
  { value: Language.de, label: 'Deutsch' },
  { value: Language.en, label: 'English' },
];

export const InviteUserForm = () => {
  const dispatch = useDispatch();
  const { data: user } = useGetMyDetailsQuery();
  const isAdmin = user?.role === UserRole.admin;
  const isWorker = user?.role === UserRole.worker;
  const { data: tenants = [], isLoading: tenantsLoading } =
  useGetTenantOptionsQuery({ enabled: isAdmin });
  const { data: stockOptions = [], isLoading: stocksLoading } =
    useGetInviteStockOptionsQuery(!!user);
  const {
    mutate: inviteUsers,
    isPending,
    isSuccess,
    data: invitationResult,
  } = useInviteUsersMutation();

  const showRoleField = !isWorker;

  const roleOptions = useMemo(() => {
    const roles = isAdmin ? UserRole : UserRoleForTenant;
    return Object.values(roles).map((role) => ({
      label: role,
      value: role,
    }));
  }, [isAdmin]);

  const {
    handleSubmit,
    watch,
    control,
  } = useForm<InviteUserFormDto>({
    mode: 'onSubmit',
    resolver: ClassValidatorResolver(new InviteUserFormDto()),
    defaultValues: {
      emails: [],
      role: UserRole.user,
      lang: Language.pl,
      tenantId: '',
      stockIds: [],
      requireTenantId: isAdmin,
    },
  });

  const role = watch('role');
  const showStocks = role === UserRole.worker;

  useEffect(() => {
    if (!isSuccess) return;

    if (invitationResult.invited.length > 0) {
      dispatch(successNotification(__('notification.invitationSendProperly')));
    }
    dispatch(showModal(<InviteUsersSuccessModal result={invitationResult} />));

    history.push(
      `/${UserService.getSlugByRole(user!.role)}/management/invitations`,
    );
  }, [isSuccess, invitationResult, user]);

  const onSubmit = (data: InviteUserFormDto) => {
    if (!user) return;

    inviteUsers({
      emails: data.emails,
      role: isWorker ? UserRole.user : data.role,
      lang: data.lang,
      tenantId: isAdmin ? data.tenantId : undefined,
      stockIds: (data.stockIds ?? []).map((id) => ({
        value: id,
        name: stockOptions.find((o) => o.value === id)?.label ?? id,
      })),
    });
  };

  if (!user) return null;

  return (
    <FormContainer highlight>
      {isPending ? <Spinner halfTransparent overlay /> : null}
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="emails"
          control={control}
          render={({ field, fieldState }) => (
            <InviteEmailsField
              name="emails"
              value={field.value ?? []}
              onChange={field.onChange}
              onBlur={field.onBlur}
              disabled={isPending}
              error={fieldState.error?.message}
            />
          )}
        />

        {showRoleField ? (
          <Controller
            name="role"
            control={control}
            render={({ field, fieldState }) => (
              <InputSelect
                name="role"
                label="application.inviteUsersRole"
                placeholder="application.inviteUsersRole"
                options={roleOptions}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                required
                disabled={isPending}
                error={fieldState.error?.message}
              />
            )}
          />
        ) : null}

        <Controller
          name="lang"
          control={control}
          render={({ field, fieldState }) => (
            <InputSelect
              name="lang"
              label="application.inviteUsersLanguage"
              placeholder="application.inviteUsersLanguage"
              options={LANGUAGE_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              required
              disabled={isPending}
              error={fieldState.error?.message}
            />
          )}
        />

        {isAdmin ? (
          <Controller
            name="tenantId"
            control={control}
            render={({ field, fieldState }) => (
              <InputSelect
                name="tenantId"
                label="application.inviteUsersTenant"
                placeholder="application.inviteUsersTenant"
                options={tenants.map((t) => ({
                  label: String(t.name),
                  value: String(t.value),
                }))}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                required
                disabled={tenantsLoading || isPending}
                error={fieldState.error?.message}
              />
            )}
          />
        ) : null}

        {showStocks ? (
          <Controller
            name="stockIds"
            control={control}
            render={({ field, fieldState }) => (
              <InputSelect
                name="stockIds"
                label="application.stocks"
                placeholder="application.stocks"
                multiple
                required
                options={stockOptions}
                value={field.value ?? []}
                onChange={field.onChange}
                onBlur={field.onBlur}
                disabled={stocksLoading || isPending}
                error={fieldState.error?.message}
              />
            )}
          />
        ) : null}

        <ButtonsContainer>
          <Button
            text="application.sendInvitation"
            type="submit"
            variant='primary'
            disabled={isPending}
          />
        </ButtonsContainer>
      </Form>
    </FormContainer>
  );
};
