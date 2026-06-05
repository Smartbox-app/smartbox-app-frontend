import { useGetLockDetailsQuery } from '../../queries/useGetLockDetailsQuery';
import { Spinner } from 'src/components/Branded';
import { Alert, Row } from 'src/components/Common';
import { Modal } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';

export type LockDetailsProps = {
  id: number;
};

export const LockDetails = ({ id }: LockDetailsProps) => {
  const { data, isFetching } = useGetLockDetailsQuery(id.toString());

  if (isFetching) {
    return (
      <>
        <Modal.Header title={__('application.lockDetails')} />
        <Modal.Content>
          <Spinner />
        </Modal.Content>
      </>
    );
  }

  if (!data) {
    return (
      <>
        <Modal.Header title={__('application.lockDetails')} />
        <Modal.Content>
          <Alert type="error">Wystąpił błąd podczas pobierania szczegółów</Alert>
        </Modal.Content>
      </>
    );
  }

  const {noKeyPwd, lockId, lockMac, lockName, lockAlias, electricQuantity} = data;

  return (
    <>
      <Modal.Header title={__('application.lockDetails')} />
      <Modal.Content>
      <Row label="ID" content={lockId} />
      <Row label="Nazwa" content={lockName} />
      <Row label="Alias" content={lockAlias} />
      <Row label="MAC" content={lockMac} />
      <Row label="Kod administratora" content={noKeyPwd} />
      <Row label="Stan baterii" content={`${electricQuantity}%`} />
      </Modal.Content>
    </>
  );
};
