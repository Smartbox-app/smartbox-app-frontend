import React from 'react';
import styled from 'styled-components';

import { documentListAdmin, documentListClient, FieldType } from 'smartbox-tables';
import { DocumentListResClient, DocumentType , UserRole } from 'smartbox-types';
import { Button } from 'src/components/Branded';
import { ApiTable } from 'src/components/Common';
import { ButtonsContainer } from 'src/components/Layout';
import { HeaderWithActions, Section } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { history } from 'src/history';
import { useGetMyDetailsQuery } from 'src/queries';
import UserService from 'src/services/user-service';
import { InteractiveTableSchema } from 'src/utils/table-schema-utils';

const documentTypeLabels: Record<DocumentType, string> = {
  'privacy-policy': 'application.documentTypePrivacyPolicy',
  rules: 'application.documentTypeRules',
  agreement: 'application.documentTypeAgreement',
};

const StyledStatusBadge = styled.span<{ $draft?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing}px;
  padding: ${({ theme }) => `${theme.spacing}px ${theme.spacing * 2}px`};
  border-radius: ${({ theme }) => theme.radius.innerSurface}px;
  font-size: 0.85rem;
  font-weight: 600;
  line-height: 1.2;
  background: ${({ theme, $draft }) =>
    $draft
      ? theme.colors.surface.attention.secondary
      : theme.colors.surface.success.secondary};
  color: ${({ theme, $draft }) =>
    $draft
      ? theme.colors.text.primary
      : theme.colors.surface.success.primary};
`;

const DocumentStatusBadge = ({ isDraft }: { isDraft?: boolean }) => (
  <StyledStatusBadge $draft={isDraft}>
    {__(isDraft ? 'application.documentStatusDraft' : 'application.documentStatusPublished')}
  </StyledStatusBadge>
);

export const List = () => {
  const { data: user } = useGetMyDetailsQuery();
  const baseSchema =
    user?.role === UserRole.admin ? documentListAdmin : documentListClient;
  const scheme = new InteractiveTableSchema(baseSchema)
    .modifyFieldStatic('type', {
      type: FieldType.Custom,
      customRender: (_value, _field, row: DocumentListResClient) =>
        __(documentTypeLabels[row.type]),
    })
    .modifyFieldStatic('stockName', {
      type: FieldType.Custom,
      customRender: (_value, _field, row: DocumentListResClient) => {
        if (row.type !== 'agreement') return '—';

        return row.stockName
          ? row.stockName
          : __('application.documentStockDefault');
      },
    })
    .modifyFieldStatic('companyName', {
      type: FieldType.Custom,
      customRender: (_value, _field, row: DocumentListResClient) => {
        if (row.type !== 'agreement') return '—';

        return row.companyName
          ? row.companyName
          : __('application.documentCompanyDefault');
      },
    })
    .modifyFieldStatic('isDraft', {
      type: FieldType.Custom,
      customRender: (_value, _field, row: DocumentListResClient) => (
        <DocumentStatusBadge isDraft={row.isDraft} />
      ),
    });

  scheme.addFieldAtTheEnd({
    name: __('application.actions'),
    field: 'actions',
    mobile: true,
    buttons: [
      {
        name: 'application.edit',
        type: 'primary',
        click: (data: DocumentListResClient) =>
          history.push(
            `/${UserService.getSlugByRole(user?.role)}/management/documents/${data.id}`,
          ),
      },
    ],
  });

  return (
    <Section>
      <HeaderWithActions
        actions={
          <ButtonsContainer>
            <Button
              text="application.addDocument"
              primary
              to={`/${UserService.getSlugByRole(user!.role)}/management/documents/add`}
            />
          </ButtonsContainer>
        }
      >
        {__('application.documentList')}
      </HeaderWithActions>

      <ApiTable scheme={scheme} apiEndpointSubUrl="document" />
    </Section>
  );
};
