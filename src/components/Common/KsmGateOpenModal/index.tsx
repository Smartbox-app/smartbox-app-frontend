import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  ApiErrorCode,
  KsmGateOpenRequestRes,
  KsmGateOpenRequestStatus,
} from 'smartbox-types';
import ApiService from 'src/services/api-service';
import { modal, notifications } from 'src/actions';
import { ButtonsContainer } from 'src/components/Layout';
import { Button, Spinner } from 'src/components/Branded';
import { Modal } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { GateAnimation } from '../GateAnimation';
import Alert from '../Alert';

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
  const [request, setRequest] = useState<KsmGateOpenRequestRes | null>(null);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const pollStatus = useCallback(async () => {
    const result = await ApiService.callFetch<KsmGateOpenRequestRes>(
      'GET',
      `v2/stock/ksm/open-gate/${requestId}`,
      undefined,
      undefined,
      undefined,
      undefined,
      true,
    );

    if (!result) return;

    setRequest(result);
    setLoading(false);

    if (TERMINAL_STATUSES.has(result.status)) {
      stopPolling();

      if (result.status === KsmGateOpenRequestStatus.SUCCESS) {
        dispatch(notifications.successNotification('notification.gateOpening'));
      } else if (result.errorCode != null) {
        dispatch(notifications.errorNotification(result.errorCode));
      } else {
        dispatch(
          notifications.errorNotification(ApiErrorCode.ErrorConnectingToGate),
        );
      }
    }
  }, [dispatch, requestId, stopPolling]);

  useEffect(() => {
    void pollStatus();
    intervalRef.current = setInterval(() => {
      void pollStatus();
    }, POLL_INTERVAL_MS);

    return () => stopPolling();
  }, [pollStatus, stopPolling]);

  const status = request?.status ?? KsmGateOpenRequestStatus.PENDING;
  const isSuccess = status === KsmGateOpenRequestStatus.SUCCESS;
  const isFailed = status === KsmGateOpenRequestStatus.FAILED;
  const isInProgress = !isSuccess && !isFailed;

  return (
    <>
      <Modal.Header title={__('application.openingGate')} />
      <Modal.Content>
        {loading && isInProgress ? <Spinner overlay halfTransparent /> : null}
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
