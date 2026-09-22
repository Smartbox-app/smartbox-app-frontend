import React, { useEffect } from 'react';

import { FormProvider, useForm } from 'react-hook-form';
import { PageHeader, Section } from 'src/components/ui';
import { DocumentDto } from 'src/dto/DocumentDto';
import { __ } from 'src/helpers/i18n';
import { useTenant } from 'src/hooks/useTenant';
import { ClassValidatorResolver } from 'src/resolvers/ClassValidatorResolver';
import { DocumentForm } from '../DocumentForm';
import {
  useCreateDocumentDraftMutation,
  usePublishDocumentMutation,
} from 'src/mutations';
import { useDispatch } from 'react-redux';
import { Redirect, useHistory } from 'react-router';
import { successNotification } from 'src/actions/notifications';
import { useGetMyDetailsQuery } from 'src/queries';
import UserService from 'src/services/user-service';
import { UserRole } from 'smartbox-types';

export const Add = () => {
  const { data: user } = useGetMyDetailsQuery();
  const { tenant } = useTenant();
  const dispatch = useDispatch();

  const history = useHistory();
  const {
    mutate: saveDraft,
    isPending: isDraftSaving,
    isSuccess: isDraftSuccess,
    data: savedDraft,
  } = useCreateDocumentDraftMutation();
  const {
    mutate: publish,
    isPending: isPublishing,
    isSuccess: isPublishSuccess,
  } = usePublishDocumentMutation();

  const methods = useForm<DocumentDto>({
    mode: 'onSubmit',
    resolver: ClassValidatorResolver(new DocumentDto()),
    defaultValues: {
      type: 'privacy-policy',
      content: {
        type: 'doc',
        content: [],
      },
      tenantId: '',
    },
  });

  const buildPayload = (data: DocumentDto): DocumentDto => {
    const payload: DocumentDto = {
      type: data.type,
      content: data.content,
    };

    if (data.type === 'agreement') {
      payload.stockId = data.stockId || null;
      payload.companyId = data.companyId || null;
    }

    if (user?.role === UserRole.client) {
      return payload;
    }

    return {
      ...payload,
      tenantId: data.tenantId,
    };
  };

  const onSaveDraft = (data: DocumentDto) => {
    saveDraft(buildPayload(data));
  };

  const onPublish = (data: DocumentDto) => {
    publish(buildPayload(data));
  };

  useEffect(() => {
    if (!isDraftSuccess || !savedDraft) return;

    dispatch(successNotification('application.documentDraftSaved'));
    history.push(
      `/${UserService.getSlugByRole(user?.role)}/management/documents/${savedDraft.id}`,
    );
  }, [isDraftSuccess, savedDraft]);

  useEffect(() => {
    if (!isPublishSuccess) return;

    dispatch(successNotification('application.documentPublished'));
  }, [isPublishSuccess]);

  if (isPublishSuccess) {
    return (
      <Redirect
        to={`/${UserService.getSlugByRole(user?.role)}/management/documents`}
      />
    );
  }

  return (
    <>
      <PageHeader>{__('application.addDocument')}</PageHeader>
      <Section>
        <FormProvider {...methods}>
          <DocumentForm
            onSaveDraft={onSaveDraft}
            onPublish={onPublish}
            isLoading={isDraftSaving || isPublishing}
          />
        </FormProvider>
      </Section>
    </>
  );
};
