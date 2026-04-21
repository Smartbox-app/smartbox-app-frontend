import React, { useEffect } from 'react';

import { FormProvider, useForm } from 'react-hook-form';
import { PageHeader, Section } from 'src/components/ui';
import { DocumentDto } from 'src/dto/DocumentDto';
import { __ } from 'src/helpers/i18n';
import { useTenant } from 'src/hooks/useTenant';
import { ClassValidatorResolver } from 'src/resolvers/ClassValidatorResolver';
import { DocumentForm } from '../DocumentForm';
import { useCreateDocumentMutation } from 'src/mutations';
import { useDispatch } from 'react-redux';
import { Redirect } from 'react-router';
import { successNotification } from 'src/actions/notifications';
import { useGetMyDetailsQuery } from 'src/queries';
import UserService from 'src/services/user-service';
import { UserRole } from 'smartbox-types';
export const Add = () => {
  const { data: user } = useGetMyDetailsQuery();
  const { tenant } = useTenant();
  const dispatch = useDispatch();
  const { mutate: save, isPending, isSuccess } = useCreateDocumentMutation();

  const methods = useForm<DocumentDto>({
    mode: 'onSubmit',
    resolver: ClassValidatorResolver(new DocumentDto()),
    defaultValues: {
      type: 'privacy-policy',
      content: {
        type: 'doc',
        content: [],
      },
      tenantId: ""
    },
  });

  const onSubmit = (data: DocumentDto) => {
    if (user?.role === UserRole.client) {
      save({
        type: data.type,
        content: data.content,
      });
    } else {
      save({
        type: data.type,
        content: data.content,
        tenantId: data.tenantId,
      });
    }
  };

  useEffect(() => {
    if (!isSuccess) return;

    dispatch(successNotification('application.documentAdded'));
  }, [isSuccess]);

  if (isSuccess)
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
          <DocumentForm onSubmit={onSubmit} isLoading={isPending} />
        </FormProvider>
      </Section>
    </>
  );
};
