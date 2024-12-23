import React from 'react';
import { ApiErrorCode, Coordinate } from 'smartbox-types';
import ApiService from '../services/api-service';
import { successNotification } from './notifications';
import { modal } from '.';
import { OpenGateByForceModal } from '../components/Common/OpenGateByForceModal';

export const askGateToOpen = (gateId: string, geo: Coordinate) => async (dispatch: any) => {
    await ApiService.patch(
        dispatch,
        'ASK_GATE_TO_OPEN_SUCCESS',
        'ASK_GATE_TO_OPEN_FAILED',
        () => {
            dispatch(successNotification("notification.gateOpening"));
        },
        (result) => {
            if (result.error_code === ApiErrorCode.UAreTooFarAway) {
                dispatch(modal.showModal(React.createElement(OpenGateByForceModal, {
                    gateId,
                    latlon: geo,
                    tooFarAway: true
                })))
            }
        },
        `stock/open-gate/${gateId}/${geo.lat}/${geo.lon}`,
        'LOADING',
        geo,
    );
};

export const askGateToOpenByForce = (gateId: string, geo: Coordinate) => async (dispatch: any) => {
    await ApiService.patch(
        dispatch,
        'ASK_GATE_TO_OPEN_SUCCESS',
        'ASK_GATE_TO_OPEN_FAILED',
        () => {
            dispatch(successNotification("notification.gateOpening"));
        },
        null,
        `stock/open-gate-by-force/${gateId}/${geo.lat}/${geo.lon}`,
        'LOADING',
    );
};

export const askGateToOpenByStaff = (gateId: string) => async (dispatch: any) => {
    await ApiService.patch(
        dispatch,
        'ASK_GATE_TO_OPEN_SUCCESS',
        'ASK_GATE_TO_OPEN_FAILED',
        () => {
            dispatch(successNotification("notification.gateRemoteOpening"));
        },
        () => {
            dispatch(successNotification("notification.gateRemoteOpeningError"));
        },
        `stock/open-gate-by-staff/${gateId}`,
        'LOADING',
    );
};
