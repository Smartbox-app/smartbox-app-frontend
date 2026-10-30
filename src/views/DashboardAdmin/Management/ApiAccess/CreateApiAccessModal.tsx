import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import { CreateApiAccessReq, CreateApiAccessRes } from 'smartbox-types';
import { refreshApiTableData } from 'src/actions/api-table';
import { hideModal, showModal } from 'src/actions/modal';
import { Spinner } from 'src/components/Branded';
import { InputSelect } from 'src/components/Common';
import { FormContainer } from 'src/components/Layout';
import { Button, Form, Input, Modal } from 'src/components/ui';
import { CreateApiAccessFormDto } from 'src/dto/CreateApiAccessFormDto';
import { __ } from 'src/helpers/i18n';
import { useApiAccessScopes } from 'src/hooks/useApiAccessScopes';
import { useCreateApiAccessMutation } from 'src/mutations';
import { useGetTenantOptionsQuery } from 'src/queries';
import { ClassValidatorResolver } from 'src/resolvers/ClassValidatorResolver';

import { ApiKeyCreatedModal } from './ApiKeyCreatedModal';

export const CreateApiAccessModal = () => {
  const dispatch = useDispatch();
  const { data: tenants = [], isLoading: tenantsLoading } =
    useGetTenantOptionsQuery();
  const { scopeOptions } = useApiAccessScopes();

  const { mutate: createApiAccess, isPending } = useCreateApiAccessMutation();

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<CreateApiAccessFormDto>({
    mode: 'onSubmit',
    resolver: ClassValidatorResolver(new CreateApiAccessFormDto()),
    defaultValues: {
      name: '',
      tenantId: '',
      scopes: [],
      expiresAt: '',
    },
  });

  const handleCreateSuccess = (createdAccess: CreateApiAccessRes | undefined) => {
    if (!createdAccess) return;
    dispatch(refreshApiTableData());
    dispatch(
      showModal(
        <ApiKeyCreatedModal
          apiKey={createdAccess.apiKey}
          name={createdAccess.name}
        />,
      ),
    );
  };

  const handleSubmitForm = (values: CreateApiAccessFormDto) => {
    const payload: CreateApiAccessReq = {
      name: values.name,
      tenantId: values.tenantId,
      scopes: values.scopes,
      expiresAt: values.expiresAt || undefined,
    };

    createApiAccess(payload, { onSuccess: handleCreateSuccess });
  };

  return (
    <Form onSubmit={handleSubmit(handleSubmitForm)}>
      <Modal.Header title={__('application.newApiAccess')} />
      <Modal.Content>
        {isPending ? <Spinner overlay halfTransparent /> : null}
        <FormContainer>
          <Controller
            name="tenantId"
            control={control}
            render={({ field, fieldState }) => (
              <InputSelect
                name="tenantId"
                label="application.apiAccessTenant"
                placeholder="application.apiAccessTenant"
                options={tenants.map((tenant) => ({
                  label: String(tenant.name),
                  value: String(tenant.value),
                }))}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                required
                isClearable={false}
                disabled={tenantsLoading || isPending}
                error={fieldState.error?.message}
              />
            )}
          />
          <Input
            label="application.apiAccessName"
            placeholder="application.apiAccessName"
            error={errors.name?.message}
            disabled={isPending}
            {...register('name')}
          />
          <Controller
            name="scopes"
            control={control}
            render={({ field, fieldState }) => (
              <InputSelect
                name="scopes"
                label="application.apiAccessScopes"
                placeholder="application.apiAccessScopes"
                multiple
                options={scopeOptions}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                required
                disabled={isPending}
                error={fieldState.error?.message}
              />
            )}
          />
          <Input
            type="date"
            label="application.apiAccessExpiresAt"
            error={errors.expiresAt?.message}
            disabled={isPending}
            {...register('expiresAt')}
          />
        </FormContainer>
      </Modal.Content>
      <Modal.Actions>
        <Button
          type="button"
          variant="secondary"
          text="application.cancel"
          onClick={() => dispatch(hideModal())}
        />
        <Button
          type="submit"
          variant="primary"
          text="application.create"
          disabled={isPending}
        />
      </Modal.Actions>
    </Form>
  );
};
