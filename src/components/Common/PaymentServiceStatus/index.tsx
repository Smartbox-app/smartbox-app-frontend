import Alert from '../Alert';
import { usePaymentServiceStatusQuery } from 'src/queries';

interface Props {
  tenantId: string;
}

export const PaymentServiceStatus = ({ tenantId }: Props) => {
  const { data: status, isPending } = usePaymentServiceStatusQuery(tenantId);

  if (isPending || status === undefined) return null;

  return (
    <Alert
      compact
      type={status ? 'success' : 'error'}
      text={
        status
          ? 'application.paymentServiceConnectionOk'
          : 'application.paymentServiceConnectionBad'
      }
    />
  );
};
