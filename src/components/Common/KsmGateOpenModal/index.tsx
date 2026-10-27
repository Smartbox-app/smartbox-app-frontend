import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

import {
  ApiErrorCode,
  KsmGateOpenRequestStatus,
} from 'smartbox-types';
import { modal, notifications } from 'src/actions';
import { Button, Spinner } from 'src/components/Branded';
import Alert from 'src/components/Common/Alert';
import { GateAnimation } from 'src/components/Common/GateAnimation';
import { ButtonsContainer } from 'src/components/Layout';
import { Modal } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { useKsmGateStatusQuery } from 'src/queries/useKsmGateStatusQuery';

const POLL_INTERVAL_MS = 1500;

const TERMINAL_STATUSES = new Set<KsmGateOpenRequestStatus>([
  KsmGateOpenRequestStatus.SUCCESS,
  KsmGateOpenRequestStatus.FAILED,
]);

const STATUS_MESSAGE_KEYS: Record<KsmGateOpenRequestStatus, string> = {
  [KsmGateOpenRequestStatus.PENDING]: 'application.ksmGateOpenStatusPending',
  [KsmGateOpenRequestStatus.PROCESSING]:
    'application.ksmGateOpenStatusProcessing',
  [KsmGateOpenRequestStatus.CONFIRMING_ALARM]:
    'application.ksmGateOpenStatusConfirmingAlarm',
  [KsmGateOpenRequestStatus.OPENING]: 'application.ksmGateOpenStatusOpening',
  [KsmGateOpenRequestStatus.SUCCESS]: 'application.ksmGateOpenStatusSuccess',
  [KsmGateOpenRequestStatus.FAILED]: 'application.ksmGateOpenStatusFailed',
};

interface Props {
  requestId: string;
}

const KsmGateOpenModal = ({ requestId }: Props) => {
  const dispatch = useDispatch();
  const terminalNotifiedRef = useRef(false);

  const { data: request, isPending, isFetching } = useKsmGateStatusQuery(
    requestId,
    { refetchInterval: POLL_INTERVAL_MS },
  );

  useEffect(() => {
    if (!request || !TERMINAL_STATUSES.has(request.status)) return;
    if (terminalNotifiedRef.current) return;
    terminalNotifiedRef.current = true;

    if (request.status === KsmGateOpenRequestStatus.SUCCESS) {
      dispatch(notifications.successNotification('notification.gateOpening'));
    } else if (request.errorCode != null) {
      dispatch(notifications.errorNotification(request.errorCode));
    } else {
      dispatch(
        notifications.errorNotification(ApiErrorCode.ErrorConnectingToGate),
      );
    }
  }, [dispatch, request]);

  const status = request?.status ?? KsmGateOpenRequestStatus.PENDING;
  const isSuccess = status === KsmGateOpenRequestStatus.SUCCESS;
  const isFailed = status === KsmGateOpenRequestStatus.FAILED;
  const isInProgress = !isSuccess && !isFailed;
  const loading = (isPending || isFetching) && isInProgress;

  return (
    <>
      <Modal.Header title={__('application.openingGate')} />
      <Modal.Content>
        {loading ? <Spinner overlay halfTransparent /> : null}
        {isSuccess ? <GateAnimation /> : null}
        <p>{__(STATUS_MESSAGE_KEYS[status])}</p>
        {request?.errorCode === ApiErrorCode.ErrorConnectingToGate && isFailed ? (
          <Alert type="error" compact>
            {__('application.unableToOpenTheGate')}
          </Alert>
        ) : null}
        {isSuccess ? (
          <Alert type="notice" compact>
            {__('application.theGateOpensNextAttempt')}
          </Alert>
        ) : null}
      </Modal.Content>
      <Modal.Actions>
        <ButtonsContainer>
          <Button
            click={() => dispatch(modal.hideModal())}
            text="application.understood"
            disabled={isInProgress}
          />
        </ButtonsContainer>
      </Modal.Actions>
    </>
  );
};

export { KsmGateOpenModal };
