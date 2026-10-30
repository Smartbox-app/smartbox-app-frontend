import React from 'react';
import styled from 'styled-components';

import { Spinner } from 'src/components/Branded';
import { Alert } from 'src/components/Common';
import {
  useGetDocumentAgreementHtmlQuery,
  useGetRentAgreementHtmlQuery,
} from 'src/queries';
import type { AgreementTemplateInput } from 'src/utils/agreement-template-query';

const PreviewContainer = styled.div`
  width: 100%;
  max-height: 50vh;
  overflow: auto;
  line-height: 1.65;
  font-size: 14px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 16px;
  background: #fff;

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
    padding-left: 20px;
  }
`;

export type AgreementPreviewProps = {
  source: 'template' | 'rent';
  template?: AgreementTemplateInput;
  rentId?: string;
  periodIndex?: number;
  stockId?: string | null;
  enabled?: boolean;
  className?: string;
  fallback?: React.ReactNode;
};

export const AgreementPreview = ({
  className,
  rentId,
  periodIndex,
  template,
  enabled,
  source,
  stockId,
  fallback,
}: AgreementPreviewProps) => {
  const rentQuery = useGetRentAgreementHtmlQuery(
    source === 'rent' ? rentId : undefined,
    periodIndex || 0,
  );

  const templateQuery = useGetDocumentAgreementHtmlQuery(
    source === 'template' ? template : undefined,
    source === 'template' && (enabled ?? true),
    stockId,
  );

  const { data, isLoading, isError } =
    source === 'rent' ? rentQuery : templateQuery;

  if (isLoading) {
    return <Spinner overlay halfTransparent />;
  }

  if (isError || !data?.html) {
    if (fallback) return <>{fallback}</>;
    return <Alert type="error" text="application.agreementPreviewError" />;
  }

  return (
    <PreviewContainer
      className={className}
      dangerouslySetInnerHTML={{ __html: data.html }}
    />
  );
};
