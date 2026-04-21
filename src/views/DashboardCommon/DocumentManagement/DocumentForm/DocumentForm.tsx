import { useFormContext, Controller, useForm } from 'react-hook-form';
import { DocumentDto } from 'src/dto/DocumentDto';
import { ButtonsContainer, FormContainer } from 'src/components/Layout';
import { Button, Form, Select } from 'src/components/ui';
import React from 'react';
import { TiptapEditor } from '../components/TiptapEditor';
import { Spinner } from 'src/components/Branded';
import { useGetDocumentTenantsQuery, useGetMyDetailsQuery } from 'src/queries';
import { UserRole } from 'smartbox-types';

export type DocumentFormProps = {
  isLoading: boolean;
  onSubmit: (dto: DocumentDto) => void;
};

export const DocumentForm = ({ onSubmit, isLoading }: DocumentFormProps) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
  } = useFormContext<DocumentDto>();

  const { data: user } = useGetMyDetailsQuery();
  const { data: tenants = [], isLoading: tenantsLoading } =
    useGetDocumentTenantsQuery();

  return (
    <FormContainer highlight>
      {isLoading ? <Spinner overlay halfTransparent /> : null}
      <Form onSubmit={handleSubmit(onSubmit)}>
        {user?.role === UserRole.admin ? (
          <Select
            label="Klient"
            placeholder={'Wybierz'}
            {...register('tenantId')}
            options={tenants.map((t) => ({
              label: t.name.toString(),
              value: t.value.toString(),
            }))}
            required={true}
            disabled={tenantsLoading || isLoading}
            error={errors.tenantId?.message}
          />
        ) : null}
        <Select
          label="Typ dokumentu"
          placeholder={'Wybierz'}
          {...register('type')}
          options={[
            {
              label: 'Polityka prywatności',
              value: 'privacy-policy',
            },
          ]}
          required={true}
          error={errors.type?.message}
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
