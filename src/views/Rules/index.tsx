import { generateHTML } from '@tiptap/core';
import React from 'react';
import { Spinner } from 'src/components/Branded';
import { useTenant } from 'src/hooks/useTenant';
import { useGetDocumentByTypeQuery } from 'src/queries';
import ApiService from 'src/services/api-service';
import { dateOnly } from 'src/utils/format-date';
import styled from 'styled-components';
import { getDocumentEditorExtensions } from 'src/config/tiptap';

const Page = styled.main`
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
  line-height: 1.65;
  font-size: 14px;

  table {
    border-collapse: collapse;
    width: 100%;
    margin: 16px 0;
  }
  th,
  td {
    border: 1px solid #000;
    padding: 8px;
    vertical-align: top;
  }
  th {
    background: #f2f2f2;
  }
  ul {
    list-style-type: disc;
    padding: 20px;
  }
`;

const H1 = styled.h1`
  font-size: 32px;
  margin-bottom: 16px;
`;

export const Rules = () => {
  const { tenant } = useTenant();
  const { data: rules, isLoading } = useGetDocumentByTypeQuery('rules');

  if (!tenant || isLoading) return <Spinner />;

  if (rules) {
    const html = generateHTML(rules.content, getDocumentEditorExtensions(false));
    return (
      <Page>
        <header>
          <H1>REGULAMIN</H1>
        </header>
        <strong>Ostatnia aktualizacja: {dateOnly(rules.updatedAt)}</strong>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </Page>
    );
  }

  if (tenant.rules) {
    window.location.href = `${ApiService.url}tenant/rules/${tenant.id}`;
  }

  return null;
};
