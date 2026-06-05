import Alert from '../Alert';
import { useInvoiceServiceStatusQuery } from 'src/queries';

interface Props {
  tenantId: string;
}

export const InvoiceStatus = ({ tenantId }: Props) => {
  const { data: status, isPending } = useInvoiceServiceStatusQuery(tenantId);

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
