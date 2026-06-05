import { useFormContext, Controller } from 'react-hook-form';
import { DocumentDto } from 'src/dto/DocumentDto';
import { ButtonsContainer, FormContainer } from 'src/components/Layout';
import { Button, Form } from 'src/components/ui';
import { InputSelect } from 'src/components/Common';
import React from 'react';
import { TiptapEditor } from '../components/TiptapEditor';
import { Spinner } from 'src/components/Branded';
import { useGetTenantOptionsQuery, useGetMyDetailsQuery } from 'src/queries';
import { UserRole } from 'smartbox-types';

export type DocumentFormProps = {
  isLoading: boolean;
  onSubmit: (dto: DocumentDto) => void;
};

const documentTypeOptions = [
  {
    label: 'Polityka prywatności',
    value: 'privacy-policy',
  },
];

export const DocumentForm = ({ onSubmit, isLoading }: DocumentFormProps) => {
  const { handleSubmit, control } = useFormContext<DocumentDto>();

  const { data: user } = useGetMyDetailsQuery();
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
            <TiptapEditor value={field.value} onChange={field.onChange} />
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
