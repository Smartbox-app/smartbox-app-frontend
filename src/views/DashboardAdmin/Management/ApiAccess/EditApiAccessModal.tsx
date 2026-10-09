import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { ApiAccessTableRes, UpdateApiAccessReq } from 'smartbox-types';
import { hideModal } from 'src/actions/modal';
import { refreshApiTableData } from 'src/actions/api-table';
import { successNotification } from 'src/actions/notifications';
import { Button, CheckBox, Form, Input, Modal } from 'src/components/ui';
import { DateInput, InputSelect } from 'src/components/Common';
import { FormContainer } from 'src/components/Layout';
import { Spinner } from 'src/components/Branded';
import { UpdateApiAccessFormDto } from 'src/dto/UpdateApiAccessFormDto';
import { __ } from 'src/helpers/i18n';
import { useUpdateApiAccessMutation } from 'src/mutations';
import { ClassValidatorResolver } from 'src/resolvers/ClassValidatorResolver';
import { dateOnlyNormalized } from 'src/utils/format-date';
import { useApiAccessScopes } from 'src/hooks/useApiAccessScopes';

type EditApiAccessModalProps = {
  row: ApiAccessTableRes;
};

export const EditApiAccessModal = ({ row }: EditApiAccessModalProps) => {
  const dispatch = useDispatch();
  const { scopeOptions, normalizeScopes } = useApiAccessScopes();
  const { mutate: updateApiAccess, isPending } = useUpdateApiAccessMutation();

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<UpdateApiAccessFormDto>({
    mode: 'onSubmit',
    resolver: ClassValidatorResolver(new UpdateApiAccessFormDto()),
    defaultValues: {
      name: row.name,
      scopes: normalizeScopes(row.scopes),
      expiresAt: row.expiresAt ? new Date(row.expiresAt) : null,
      isActive: row.isActive !== false,
    },
  });

  const handleUpdateSuccess = () => {
    dispatch(hideModal());
    dispatch(refreshApiTableData());
    dispatch(successNotification(__('application.apiAccessUpdated')));
  };

  const handleSubmitForm = (values: UpdateApiAccessFormDto) => {
    const payload: UpdateApiAccessReq = {
      name: values.name,
      scopes: values.scopes,
      isActive: values.isActive,
      expiresAt: values.expiresAt ? dateOnlyNormalized(values.expiresAt) : null,
    };

    updateApiAccess(
      { id: row.id, body: payload },
      { onSuccess: handleUpdateSuccess },
    );
  };

  return (
    <Form onSubmit={handleSubmit(handleSubmitForm)}>
      <Modal.Header title={__('application.apiAccessEdit')} />
      <Modal.Content>
        {isPending ? <Spinner overlay halfTransparent /> : null}
        <FormContainer>
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
          <Controller
            name="expiresAt"
            control={control}
            render={({ field, fieldState }) => (
              <DateInput
                name="expiresAt"
                label="application.apiAccessExpiresAt"
                value={field.value ?? undefined}
                onChange={([selected]: Date[]) => {
                  field.onChange(selected ?? null);
                }}
                inline={false}
                required={false}
                error={fieldState.error?.message}
              />
            )}
          />
          <CheckBox
            label="application.apiAccessIsActive"
            error={errors.isActive?.message}
            disabled={isPending}
            {...register('isActive')}
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
          text="application.save"
          disabled={isPending}
        />
      </Modal.Actions>
    </Form>
  );
};
