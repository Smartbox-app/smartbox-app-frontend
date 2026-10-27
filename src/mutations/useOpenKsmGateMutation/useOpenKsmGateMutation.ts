import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { useDispatch } from 'react-redux';

import { ApiErrorCode, Coordinate } from 'smartbox-types';
import { modal } from 'src/actions';
import { errorNotification } from 'src/actions/notifications';
import { KsmGateOpenModal } from 'src/components/Common/KsmGateOpenModal';
import { OpenGateByForceModal } from 'src/components/Common/OpenGateByForceModal';
import { OpenGateTooSoonModal } from 'src/components/Common/OpenGateTooSoonModal';
import ApiService from 'src/services/api-service';
import type { AppDispatch } from 'src/types/app-dispatch';

export type OpenKsmGateMode = 'default' | 'force';

export type OpenKsmGateVariables = {
  gateId: string;
  geo: Coordinate;
  mode: OpenKsmGateMode;
};

type KsmGateErrorBody = { error_code?: ApiErrorCode };

const handleKsmGateOpenError = (
  dispatch: AppDispatch,
  errorCode: ApiErrorCode,
  onTooFarAway?: () => void,
): boolean => {
  if (errorCode === ApiErrorCode.UAreTooFarAway && onTooFarAway) {
    onTooFarAway();
    return true;
  }

  if (errorCode === ApiErrorCode.OpenGateTooSoon) {
    dispatch(modal.showModal(React.createElement(OpenGateTooSoonModal)));
    return true;
  }

  return false;
};

export const useOpenKsmGateMutation = () => {
  const dispatch = useDispatch<AppDispatch>();

  return useMutation({
    mutationKey: ['ksm-gate', 'open'],
    mutationFn: async ({
      gateId,
      geo,
      mode,
    }: OpenKsmGateVariables): Promise<string | null> => {
      const path =
        mode === 'force'
          ? `v2/stock/ksm/open-gate-by-force/${gateId}/${geo.lat}/${geo.lon}`
          : `v2/stock/ksm/open-gate/${gateId}/${geo.lat}/${geo.lon}`;

      let requestId: string | null = null;

      await ApiService.callFetch<{ id: string }>(
        'PATCH',
        path,
        (payload) => {
          requestId = payload.id;
        },
        (result) => {
          const errorCode = (result as KsmGateErrorBody).error_code;
          if (errorCode == null) return false;

          if (
            mode === 'default' &&
            errorCode === ApiErrorCode.UAreTooFarAway
          ) {
            return handleKsmGateOpenError(dispatch, errorCode, () => {
              dispatch(
                modal.showModal(
                  React.createElement(OpenGateByForceModal, {
                    gateId,
                    latlon: geo,
                    tooFarAway: true,
                    useKsmV2: true,
                  }),
                ),
              );
            });
          }

          if (handleKsmGateOpenError(dispatch, errorCode)) {
            return true;
          }

          dispatch(errorNotification(errorCode));
          return true;
        },
        undefined,
        false,
        true,
      );

      return requestId;
    },
    onSuccess: (requestId, variables) => {
      if (!requestId) return;

      if (variables.mode === 'force') {
        dispatch(modal.hideModal());
      }

      dispatch(
        modal.showModal(
          React.createElement(KsmGateOpenModal, { requestId }),
        ),
      );
    },
  });
};
