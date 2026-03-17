import React, { useEffect } from 'react';

import { FormProvider, useForm } from 'react-hook-form';
import { PageHeader, Section } from 'src/components/ui';
import { DocumentDto } from 'src/dto/DocumentDto';
import { __ } from 'src/helpers/i18n';
import { useTenant } from 'src/hooks/useTenant';
import { ClassValidatorResolver } from 'src/resolvers/ClassValidatorResolver';
import { DocumentForm } from '../DocumentForm';
import {
  useUpdateDocumentMutation,
} from 'src/mutations';
import { useDispatch } from 'react-redux';
import { Redirect, useParams } from 'react-router';
import { successNotification } from 'src/actions/notifications';
import { useGetDocumentByIdQuery, useGetMyDetailsQuery } from 'src/queries';
import UserService from 'src/services/user-service';

export const Edit = () => {
  const { data: user } = useGetMyDetailsQuery();
  const { id } = useParams<{ id: string }>();
  const { tenant } = useTenant();
  const dispatch = useDispatch();
  const { data: document, isLoading } = useGetDocumentByIdQuery(id);
  const { mutate: save, isPending, isSuccess } = useUpdateDocumentMutation(id);

  const methods = useForm<DocumentDto>({
    mode: 'onSubmit',
    resolver: ClassValidatorResolver(new DocumentDto()),
    defaultValues: {
      type: 'privacy-policy',
      content: {
        type: 'doc',
        content: [],
      },
      tenantId: tenant?.id,
    },
  });

  const onSubmit = (data: DocumentDto) => {
    save(data);
  };

  useEffect(() => {
    if (!document) return;

    methods.reset({
      tenantId: tenant?.id,
      type: document.type,
      content: document.content,
    });
  }, [document]);

  useEffect(() => {
    if (!isSuccess) return;

    dispatch(successNotification('application.documentEdited'));
  }, [isSuccess]);

  if (isSuccess || !id)
    return (
      <Redirect
        to={`/${UserService.getSlugByRole(user?.role)}/management/documents`}
      />
    );

  return (
    <>
      <PageHeader>{__('application.addDocument')}</PageHeader>
      <Section>
        <FormProvider {...methods}>
          <DocumentForm
            onSubmit={onSubmit}
            isLoading={isPending || isLoading}
          />
        </FormProvider>
      </Section>
    </>
  );
};
