import Alert from 'src/components/Common/Alert';
import { useSmsServiceStatusQuery } from 'src/queries';

interface Props {
  tenantId: string;
}

export const SmsStatus = ({ tenantId }: Props) => {
  const { data: status, isPending } = useSmsServiceStatusQuery(tenantId);

  if (isPending || status === undefined) return null;

  return (
    <Alert
      compact
      type={status ? 'success' : 'error'}
      text={
        status ? 'application.smsConnectionOk' : 'application.smsConnectionBad'
      }
    />
  );
};
