import { useFormContext, Controller } from 'react-hook-form';
import { DocumentDto } from 'src/dto/DocumentDto';
import { ButtonsContainer, FormContainer } from 'src/components/Layout';
import { Button, Form } from 'src/components/ui';
import { InputSelect } from 'src/components/Common';
import React from 'react';
import { TiptapEditor } from '../components/TiptapEditor';
import { Spinner } from 'src/components/Branded';
import { useGetTenantOptionsQuery, useGetMyDetailsQuery } from 'src/queries';
import { DocumentType, UserRole } from 'smartbox-types';
import { useTenant } from 'src/hooks/useTenant';

export type DocumentFormProps = {
  isLoading: boolean;
  onSubmit: (dto: DocumentDto) => void;
};

const documentTypeOptions: {label: string, value: DocumentType}[] = [
  {
    label: 'Polityka prywatności',
    value: 'privacy-policy',
  },
  {
    label: 'Regulamin',
    value: 'rules',
  },
  {
    label: 'Umowa',
    value: 'agreement',
  },
];

export const DocumentForm = ({ onSubmit, isLoading }: DocumentFormProps) => {
  const { handleSubmit, control, watch } = useFormContext<DocumentDto>();
  const selectedTenantId = watch('tenantId');
  const documentType = watch('type');

  const { data: user } = useGetMyDetailsQuery();
  const { tenant } = useTenant();
  const templateTenantId =
    user?.role === UserRole.admin ? selectedTenantId : tenant?.id;
  const { data: tenants = [], isLoading: tenantsLoading } =
  useGetTenantOptionsQuery({ enabled: user?.role === UserRole.admin });

  return (
    <FormContainer highlight fullWidth>
      {isLoading ? <Spinner overlay halfTransparent /> : null}
      <Form onSubmit={handleSubmit(onSubmit)}>
        {user?.role === UserRole.admin ? (
          <Controller
            name="tenantId"
            control={control}
            render={({ field, fieldState }) => (
              <InputSelect
                name="tenantId"
                label="Klient"
                placeholder="Wybierz"
                options={tenants.map((t) => ({
                  label: t.name.toString(),
                  value: t.value.toString(),
                }))}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                required
                disabled={tenantsLoading || isLoading}
                error={fieldState.error?.message}
              />
            )}
          />
        ) : null}
        <Controller
          name="type"
          control={control}
          render={({ field, fieldState }) => (
            <InputSelect
              name="type"
              label="Typ dokumentu"
              placeholder="Wybierz"
              options={documentTypeOptions}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              required
              error={fieldState.error?.message}
            />
          )}
        />
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <TiptapEditor
              value={field.value}
              onChange={field.onChange}
              documentType={documentType}
              templateTenantId={templateTenantId}
            />
          )}
        />
        <ButtonsContainer>
          <Button
            variant="primary"
            text="application.apply"
            type="submit"
            disabled={isLoading}
          />
        </ButtonsContainer>
      </Form>
    </FormContainer>
  );
};
