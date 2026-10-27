import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Redirect, useParams } from 'react-router';

import { UserRole } from 'smartbox-types';
import { successNotification } from 'src/actions/notifications';
import { PageHeader, Section } from 'src/components/ui';
import { DocumentDto } from 'src/dto/DocumentDto';
import { __ } from 'src/helpers/i18n';
import { history } from 'src/history';
import { useTenant } from 'src/hooks/useTenant';
import {
  usePublishDocumentMutation,
  useSaveDocumentDraftMutation,
} from 'src/mutations';
import {
  useGetDocumentByIdQuery,
  useGetDocumentDraftQuery,
  useGetMyDetailsQuery,
} from 'src/queries';
import { documentDraftQueryKey } from 'src/queries/useGetDocumentDraftQuery/useGetDocumentDraftQuery';
import { ClassValidatorResolver } from 'src/resolvers/ClassValidatorResolver';
import UserService from 'src/services/user-service';
import { DocumentForm } from 'src/views/DashboardCommon/DocumentManagement/DocumentForm';

export const Edit = () => {
  const { data: user } = useGetMyDetailsQuery();
  const { id } = useParams<{ id: string }>();
  const { tenant } = useTenant();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { data: document, isLoading } = useGetDocumentByIdQuery(id);
  const { data: draft, isLoading: isDraftLoading } =
    useGetDocumentDraftQuery(id);
  const {
    mutate: saveDraft,
    data: savedDraft,
    isPending: isDraftSaving,
    isSuccess: isDraftSuccess,
  } = useSaveDocumentDraftMutation(id);
  const {
    mutate: publish,
    isPending: isPublishing,
    isSuccess: isPublishSuccess,
  } = usePublishDocumentMutation(id);

  const methods = useForm<DocumentDto>({
    mode: 'onSubmit',
    resolver: ClassValidatorResolver(new DocumentDto()),
    defaultValues: {
      type: 'privacy-policy',
      content: {
        type: 'doc',
        content: [],
      },
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
    if (!document) return;

    methods.reset({
      tenantId: user?.role === UserRole.client ? tenant?.id : document.tenantId,
      type: document.type,
      content: document.content,
      stockId: document.stockId ?? null,
      companyId: document.companyId ?? null,
    });
  }, [document, user, tenant]);

  const isEditingPublished = Boolean(document && !document.isDraft);
  const hasSeparateDraft = Boolean(isEditingPublished && draft);

  useEffect(() => {
    if (!isDraftSuccess || !savedDraft) return;

    dispatch(successNotification('application.documentDraftSaved'));

    if (isEditingPublished) {
      history.replace(
        `/${UserService.getSlugByRole(user?.role)}/management/documents/${savedDraft.id}`,
      );
    }
    queryClient.invalidateQueries({ queryKey: documentDraftQueryKey(id) });
  }, [isDraftSuccess, savedDraft, isEditingPublished]);

  useEffect(() => {
    if (!isPublishSuccess) return;

    dispatch(
      successNotification(
        isEditingPublished
          ? 'application.documentNewVersionPublished'
          : 'application.documentPublished',
      ),
    );
  }, [isPublishSuccess, isEditingPublished, dispatch]);

  if (isPublishSuccess || !id) {
    return (
      <Redirect
        to={`/${UserService.getSlugByRole(user?.role)}/management/documents`}
      />
    );
  }

  return (
    <>
      <PageHeader>{__('application.editDocument')}</PageHeader>
      <Section>
        <FormProvider {...methods}>
          <DocumentForm
            onSaveDraft={onSaveDraft}
            onPublish={onPublish}
            isLoading={
              isDraftSaving || isPublishing || isLoading || isDraftLoading
            }
            hasDraft={hasSeparateDraft}
            isEditingPublished={isEditingPublished}
          />
        </FormProvider>
      </Section>
    </>
  );
};
