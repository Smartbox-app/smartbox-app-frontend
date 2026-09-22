import React, { useEffect } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { DocumentDto } from 'src/dto/DocumentDto';
import { ButtonsContainer, FormContainer } from 'src/components/Layout';
import { Button, Form } from 'src/components/ui';
import { InputSelect } from 'src/components/Common';
import { TiptapEditor } from '../components/TiptapEditor';
import { Spinner } from 'src/components/Branded';
import {
  useGetTenantOptionsQuery,
  useGetMyDetailsQuery,
  useGetStockOptionsQuery,
  useGetCompanyOptionsQuery,
} from 'src/queries';
import { DocumentType, UserRole } from 'smartbox-types';
import { useTenant } from 'src/hooks/useTenant';
import { Alert, ConfirmModal } from 'src/components/Common';
import { useDispatch } from 'react-redux';
import { showModal } from 'src/actions/modal';
import { __ } from 'src/helpers/i18n';

export type DocumentFormProps = {
  isLoading: boolean;
  hasDraft?: boolean;
  isEditingPublished?: boolean;
  onSaveDraft: (dto: DocumentDto) => void;
  onPublish: (dto: DocumentDto) => void;
};

const documentTypeOptions: { label: string; value: DocumentType }[] = [
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

export const DocumentForm = ({
  onSaveDraft,
  onPublish,
  isLoading,
  hasDraft = false,
  isEditingPublished = false,
}: DocumentFormProps) => {
  const dispatch = useDispatch();
  const { handleSubmit, control, watch, setValue } =
    useFormContext<DocumentDto>();
  const selectedTenantId = watch('tenantId');
  const selectedStockId = watch('stockId');
  const documentType = watch('type');
  const isAgreement = documentType === 'agreement';

  const { data: user } = useGetMyDetailsQuery();
  const { tenant } = useTenant();
  const templateTenantId =
    user?.role === UserRole.admin ? selectedTenantId : tenant?.id;
  const { data: tenants = [], isLoading: tenantsLoading } =
    useGetTenantOptionsQuery({ enabled: user?.role === UserRole.admin });
  const canLoadStocks =
    isAgreement &&
    (user?.role !== UserRole.admin || Boolean(selectedTenantId));
  const { data: stockOptions = [], isLoading: stocksLoading } =
    useGetStockOptionsQuery(
      user?.role === UserRole.admin ? selectedTenantId : tenant?.id,
      canLoadStocks,
    );
  const canLoadCompanies =
    isAgreement &&
    (user?.role !== UserRole.admin || Boolean(selectedTenantId));
  const { data: companyOptions = [], isLoading: companiesLoading } =
    useGetCompanyOptionsQuery(
      user?.role === UserRole.admin ? selectedTenantId : tenant?.id,
      canLoadCompanies,
    );

  useEffect(() => {
    if (!isAgreement) {
      setValue('stockId', null);
      setValue('companyId', null);
    }
  }, [isAgreement, setValue]);

  const confirmPublish = handleSubmit((data) => {
    dispatch(
      showModal(
        <ConfirmModal
          mainText="application.documentPublishConfirm"
          approveButtonText="application.publishDocument"
          approveAction={() => onPublish(data)}
        />,
      ),
    );
  });

  return (
    <FormContainer highlight fullWidth>
      {isLoading ? <Spinner overlay halfTransparent /> : null}
      {hasDraft ? (
        <Alert type="notice" text="application.documentDraftExists" />
      ) : isEditingPublished ? (
        <Alert type="notice" text="application.documentEditingPublishedInfo" />
      ) : null}
      <Form onSubmit={(event) => event.preventDefault()}>
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
                onChange={(value) => {
                  field.onChange(value);
                  setValue('stockId', null);
                  setValue('companyId', null);
                }}
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
        {isAgreement ? (
          <>
          <Controller
            name="stockId"
            control={control}
            render={({ field, fieldState }) => (
              <InputSelect
                name="stockId"
                label={__('application.documentStock')}
                placeholder={__('application.documentStockPlaceholder')}
                options={[
                  {
                    label: __('application.documentStockDefault'),
                    value: '',
                  },
                  ...stockOptions.map((stock) => ({
                    label: stock.label,
                    value: stock.value,
                  })),
                ]}
                value={field.value ?? ''}
                onChange={(value) => {
                  field.onChange(value || null);
                }}
                onBlur={field.onBlur}
                disabled={
                  isLoading ||
                  stocksLoading ||
                  (user?.role === UserRole.admin && !selectedTenantId)
                }
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="companyId"
            control={control}
            render={({ field, fieldState }) => (
              <InputSelect
                name="companyId"
                label={__('application.documentCompany')}
                placeholder={__('application.documentCompanyPlaceholder')}
                options={[
                  {
                    label: __('application.documentCompanyDefault'),
                    value: '',
                  },
                  ...companyOptions.map((company) => ({
                    label: company.label,
                    value: company.value,
                  })),
                ]}
                value={field.value ?? ''}
                onChange={(value) => {
                  field.onChange(value || null);
                }}
                onBlur={field.onBlur}
                disabled={
                  isLoading ||
                  companiesLoading ||
                  (user?.role === UserRole.admin && !selectedTenantId)
                }
                error={fieldState.error?.message}
              />
            )}
          />
          </>
        ) : null}
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <TiptapEditor
              value={field.value}
              onChange={field.onChange}
              documentType={documentType}
              templateTenantId={templateTenantId}
              templateStockId={selectedStockId}
            />
          )}
        />
        <ButtonsContainer>
          <Button
            variant={isEditingPublished ? 'primary' : 'secondary'}
            text={
              isEditingPublished
                ? 'application.saveDocumentAsDraft'
                : 'application.saveDocumentDraft'
            }
            type="button"
            disabled={isLoading}
            onClick={handleSubmit(onSaveDraft)}
          />
          {!isEditingPublished ? (
            <Button
              variant="primary"
              text="application.publishDocument"
              type="button"
              disabled={isLoading}
              onClick={() => void confirmPublish()}
            />
          ) : null}
        </ButtonsContainer>
      </Form>
    </FormContainer>
  );
};
