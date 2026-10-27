import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { useDispatch } from 'react-redux';

import { ApiErrorCode, Coordinate } from 'smartbox-types';
import { modal } from 'src/actions';
import {
  errorNotificationText,
  successNotification,
} from 'src/actions/notifications';
import { OpenGateByForceModal } from 'src/components/Common/OpenGateByForceModal';
import { OpenGateSuccessModal } from 'src/components/Common/OpenGateSuccessModal';
import { OpenGateTooSoonModal } from 'src/components/Common/OpenGateTooSoonModal';
import ApiService from 'src/services/api-service';
import type { AppDispatch } from 'src/types/app-dispatch';

export type OpenGateMode = 'default' | 'force' | 'staff';

export type OpenGateVariables = {
  gateId: string;
  mode: OpenGateMode;
  geo?: Coordinate;
};

const buildOpenGatePath = ({ gateId, mode, geo }: OpenGateVariables) => {
  switch (mode) {
    case 'staff':
      return `stock/open-gate-by-staff/${gateId}`;
    case 'force':
      if (!geo) throw new Error('geo is required for force gate opening');
      return `stock/open-gate-by-force/${gateId}/${geo.lat}/${geo.lon}`;
    default:
      if (!geo) throw new Error('geo is required for gate opening');
      return `stock/open-gate/${gateId}/${geo.lat}/${geo.lon}`;
  }
};

type GateErrorBody = { error_code?: ApiErrorCode };

const handleGateOpenError = (
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

export const useOpenGateMutation = () => {
  const dispatch = useDispatch<AppDispatch>();

  return useMutation({
    mutationKey: ['gate', 'open'],
    mutationFn: async (variables: OpenGateVariables): Promise<boolean> => {
      const path = buildOpenGatePath(variables);
      const requestGeo = variables.mode === 'default' ? variables.geo : undefined;
      let success = false;

      await ApiService.callFetch(
        'PATCH',
        path,
        () => {
          success = true;
        },
        (result) => {
          const errorCode = (result as GateErrorBody).error_code;
          if (errorCode == null) return false;

          if (variables.mode === 'staff') {
            dispatch(
              errorNotificationText('notification.gateRemoteOpeningError'),
            );
            return true;
          }

          if (
            variables.mode === 'default' &&
            errorCode === ApiErrorCode.UAreTooFarAway &&
            variables.geo
          ) {
            return handleGateOpenError(dispatch, errorCode, () => {
              dispatch(
                modal.showModal(
                  React.createElement(OpenGateByForceModal, {
                    gateId: variables.gateId,
                    latlon: variables.geo!,
                    tooFarAway: true,
                  }),
                ),
              );
            });
          }

          return handleGateOpenError(dispatch, errorCode);
        },
        requestGeo,
        false,
        true,
      );

      return success;
    },
    onSuccess: (success, variables) => {
      if (!success) return;

      if (variables.mode === 'staff') {
        dispatch(successNotification('notification.gateRemoteOpening'));
        return;
      }

      dispatch(successNotification('notification.gateOpening'));
      dispatch(modal.showModal(React.createElement(OpenGateSuccessModal)));
    },
  });
};
