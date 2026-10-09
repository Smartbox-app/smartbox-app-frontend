import type { AppDispatch } from 'src/types/app-dispatch';
import React from 'react';
import { ApiErrorCode, Coordinate } from 'smartbox-types';
import ApiService from '../services/api-service';
import { errorNotificationText, successNotification } from './notifications';
import { modal } from '.';
import { OpenGateByForceModal } from '../components/Common/OpenGateByForceModal';
import { OpenGateTooSoonModal } from '../components/Common/OpenGateTooSoonModal';
import { OpenGateSuccessModal } from '../components/Common/OpenGateSuccessModal';

const showGateOpeningSuccess = (dispatch: AppDispatch, notificationKey: 'notification.gateOpening' | 'notification.gateRemoteOpening') => {
    dispatch(successNotification(notificationKey));
    dispatch(modal.showModal(React.createElement(OpenGateSuccessModal)));
};

const handleGateOpenError = (
    dispatch: AppDispatch,
    result: { error_code: ApiErrorCode },
    onTooFarAway?: () => void,
): boolean => {
    if (result.error_code === ApiErrorCode.UAreTooFarAway && onTooFarAway) {
        onTooFarAway();
        return true;
    }

    if (result.error_code === ApiErrorCode.OpenGateTooSoon) {
        dispatch(modal.showModal(React.createElement(OpenGateTooSoonModal)));
        return true;
    }

    return false;
};

export const askGateToOpen = (gateId: string, geo: Coordinate) => async (dispatch: AppDispatch) => {
    await ApiService.patch(
        dispatch,
        'ASK_GATE_TO_OPEN_SUCCESS',
        'ASK_GATE_TO_OPEN_FAILED',
        () => {
            showGateOpeningSuccess(dispatch, 'notification.gateOpening');
        },
        (result) =>
            handleGateOpenError(dispatch, result as unknown as { error_code: ApiErrorCode }, () => {
                dispatch(modal.showModal(React.createElement(OpenGateByForceModal, {
                    gateId,
                    latlon: geo,
                    tooFarAway: true
                })));
            }),
        `stock/open-gate/${gateId}/${geo.lat}/${geo.lon}`,
        'LOADING',
        geo,
    );
};

export const askGateToOpenByForce = (gateId: string, geo: Coordinate) => async (dispatch: AppDispatch) => {
    await ApiService.patch(
        dispatch,
        'ASK_GATE_TO_OPEN_SUCCESS',
        'ASK_GATE_TO_OPEN_FAILED',
        () => {
            showGateOpeningSuccess(dispatch, 'notification.gateOpening');
        },
        (result) => handleGateOpenError(dispatch, result as unknown as { error_code: ApiErrorCode }),
        `stock/open-gate-by-force/${gateId}/${geo.lat}/${geo.lon}`,
        'LOADING',
    );
};

export const askGateToOpenByStaff = (gateId: string) => async (dispatch: AppDispatch) => {
    await ApiService.patch(
        dispatch,
        'ASK_GATE_TO_OPEN_SUCCESS',
        'ASK_GATE_TO_OPEN_FAILED',
        () => {
            dispatch(successNotification('notification.gateRemoteOpening'));
        },
        () => {
            dispatch(errorNotificationText("notification.gateRemoteOpeningError"));
        },
        `stock/open-gate-by-staff/${gateId}`,
        'LOADING',
    );
};
