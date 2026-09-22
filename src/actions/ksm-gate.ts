import React from 'react';
import { ApiErrorCode, Coordinate } from 'smartbox-types';
import ApiService from '../services/api-service';
import { errorNotification } from './notifications';
import * as modalActions from './modal';
import { store } from '../store';
import { OpenGateTooSoonModal } from '../components/Common/OpenGateTooSoonModal';
import { OpenGateByForceModal } from '../components/Common/OpenGateByForceModal';
import { KsmGateOpenModal } from '../components/Common/KsmGateOpenModal';

const showKsmGateOpenModal = (dispatch: any, requestId: string) => {
  dispatch(
    modalActions.showModal(
      React.createElement(KsmGateOpenModal, { requestId }),
    ),
  );
};

const handleKsmGateOpenError = (
  dispatch: any,
  result: { error_code: ApiErrorCode },
  onTooFarAway?: () => void,
): boolean => {
  if (result.error_code === ApiErrorCode.UAreTooFarAway && onTooFarAway) {
    onTooFarAway();
    return true;
  }

  if (result.error_code === ApiErrorCode.OpenGateTooSoon) {
    dispatch(modalActions.showModal(React.createElement(OpenGateTooSoonModal)));
    return true;
  }

  return false;
};

export const requestKsmGateOpenV2 =
  (gateId: string, geo: Coordinate) => async (dispatch: any) => {
    await ApiService.callFetch(
      'PATCH',
      `v2/stock/ksm/open-gate/${gateId}/${geo.lat}/${geo.lon}`,
      (payload: { id: string }) => {
        showKsmGateOpenModal(dispatch, payload.id);
      },
      (result: { error_code: ApiErrorCode }) => {
        if (
          handleKsmGateOpenError(dispatch, result, () => {
            dispatch(
              modalActions.showModal(
                React.createElement(OpenGateByForceModal, {
                  gateId,
                  latlon: geo,
                  tooFarAway: true,
                  useKsmV2: true,
                }),
              ),
            );
          })
        ) {
          return;
        }

        store.dispatch(errorNotification(result.error_code));
      },
      undefined,
      undefined,
      true,
    );
  };

export const requestKsmGateOpenByForceV2 =
  (gateId: string, geo: Coordinate) => async (dispatch: any) => {
    await ApiService.callFetch(
      'PATCH',
      `v2/stock/ksm/open-gate-by-force/${gateId}/${geo.lat}/${geo.lon}`,
      (payload: { id: string }) => {
        dispatch(modalActions.hideModal());
        showKsmGateOpenModal(dispatch, payload.id);
      },
      (result: { error_code: ApiErrorCode }) => {
        if (handleKsmGateOpenError(dispatch, result)) {
          return;
        }

        store.dispatch(errorNotification(result.error_code));
      },
      undefined,
      undefined,
      true,
    );
  };
