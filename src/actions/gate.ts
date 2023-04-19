import { Coordinate } from 'smartbox-types';
import ApiService from '../services/api-service';
import { successNotification } from './notifications';

export const gateOpenStartAnimation = (open:boolean = true) => ({ type: 'GATE_OPEN_START_ANIMATION', payload: open });

export const askGateToOpen = (geo: Coordinate) => async (dispatch: any) => {
  await ApiService.patch(
    dispatch,
    'ASK_GATE_TO_OPEN_SUCCESS',
    'ASK_GATE_TO_OPEN_FAILED',
    () => {
      dispatch(successNotification("notification.gateOpening"));
      dispatch(gateOpenStartAnimation());
    },
    null,
    `stock/open-gate/${geo.lat}/${geo.lon}`,
    'LOADING',
    geo,
  );
};

export const askGateToOpenStuff = (stockId: string) => async (dispatch: any) => {
  await ApiService.patch(
    dispatch,
    'ASK_GATE_TO_OPEN_SUCCESS',
    'ASK_GATE_TO_OPEN_FAILED',
    () => {
      dispatch(successNotification("notification.gateRemoteOpening"));
      dispatch(gateOpenStartAnimation());
    },
    () => {
      dispatch(successNotification("notification.gateRemoteOpeningError"));
    },
    `stock/open-gate-by-staff/${stockId}`,
    'LOADING',
  );
};
