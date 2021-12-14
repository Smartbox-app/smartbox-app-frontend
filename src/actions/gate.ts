import { Coordinate } from 'smartbox-types';
import ApiService from '../services/api-service';
import { successNotification } from './notifications';
import {__} from "../helpers/i18n";

export const gateOpenStartAnimation = (open:boolean = true) => ({ type: 'GATE_OPEN_START_ANIMATION', payload: open });

export const askGateToOpen = (geo: Coordinate) => async (disaptch: any) => {
  await ApiService.patch(
    disaptch,
    'ASK_GATE_TO_OPEN_SUCCESS',
    'ASK_GATE_TO_OPEN_FAILED',
    () => {
      disaptch(successNotification("notification.gateOpening"));
      disaptch(gateOpenStartAnimation());
    },
    null,
    `stock/open-gate/${geo.lat}/${geo.lon}`,
    'LOADING',
    geo,
  );
};

export const askGateToOpenStuff = (stockId: string) => async (disaptch: any) => {
  await ApiService.patch(
    disaptch,
    'ASK_GATE_TO_OPEN_SUCCESS',
    'ASK_GATE_TO_OPEN_FAILED',
    () => {
      disaptch(successNotification("notification.gateRemoteOpening"));
      disaptch(gateOpenStartAnimation());
    },
    () => {
      disaptch(successNotification("notification.gateRemoteOpeningError"));
    },
    `stock/open-gate-by-staff/${stockId}`,
    'LOADING',
  );
};
