import { Spinner } from 'src/components/Branded';
import { Alert, Row } from 'src/components/Common';
import { Modal } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { useGetLockDetailsQuery } from '../../queries/useGetLockDetailsQuery';

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
          <Alert type="error" text="application.phrases.lockDetailsError" />
        </Modal.Content>
      </>
    );
  }

  const { noKeyPwd, lockId, lockMac, lockName, lockAlias, electricQuantity } =
    data;

  return (
    <>
      <Modal.Header title={__('application.lockDetails')} />
      <Modal.Content>
        <Row label="application.tables.id" content={lockId} />
        <Row label="application.tables.name" content={lockName} />
        <Row label="application.tables.alias" content={lockAlias} />
        <Row label="application.tables.mac" content={lockMac} />
        <Row label="application.phrases.adminCode" content={noKeyPwd} />
        <Row
          label="application.batteryStatus"
          content={`${electricQuantity}%`}
        />
      </Modal.Content>
    </>
  );
};
