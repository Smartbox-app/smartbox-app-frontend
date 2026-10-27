import React from 'react';

import Alert from 'src/components/Common/Alert';
import { useCompanyInvoiceServiceStatusQuery } from 'src/queries';

interface Props {
  companyId: string;
}

export const CompanyInvoiceStatus = ({ companyId }: Props) => {
  const { data: status, isPending } =
    useCompanyInvoiceServiceStatusQuery(companyId);

  if (isPending || status === undefined) return null;

  return (
    <Alert
      compact
      type={status ? 'success' : 'error'}
      text={
        status
          ? 'application.invoiceConnectionOk'
          : 'application.invoiceConnectionBad'
      }
    />
  );
};
