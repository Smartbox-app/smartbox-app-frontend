import { useGetLockDetailsQuery } from '../../queries/useGetLockDetailsQuery';
import { Spinner } from 'src/components/Branded';
import { Alert, Row } from 'src/components/Common';

export type LockDetailsProps = {
  id: number;
};

export const LockDetails = ({ id }: LockDetailsProps) => {
  const { data, isFetching } = useGetLockDetailsQuery(id.toString());

  if (isFetching) return <Spinner />;

  if(!data) return <Alert type='error'>Wystąpił błąd podczas pobierania szczegółów</Alert>

  const {noKeyPwd, lockId, lockMac, lockName, lockAlias, electricQuantity} = data;

  return (
    <>
      <Row label="ID" content={lockId} />
      <Row label="Nazwa" content={lockName} />
      <Row label="Alias" content={lockAlias} />
      <Row label="MAC" content={lockMac} />
      <Row label="Kod administratora" content={noKeyPwd} />
      <Row label="Stan baterii" content={`${electricQuantity}%`} />
    </>
  );
};
