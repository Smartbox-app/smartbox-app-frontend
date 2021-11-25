import { Coordinate } from 'smartbox-types';
import ApiService from '../services/api-service';
import { successNotification } from './notifications';

export const gateOpenStartAnimation = (open:boolean = true) => ({ type: 'GATE_OPEN_START_ANIMATION', payload: open });

export const askGateToOpen = (geo: Coordinate) => async (disaptch: any) => {
  await ApiService.patch(
    disaptch,
    'ASK_GATE_TO_OPEN_SUCCESS',
    'ASK_GATE_TO_OPEN_FAILED',
    () => {
      disaptch(successNotification('Otwieram bramę'));
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
      disaptch(successNotification('Otwieram bramę zdalnie'));
      disaptch(gateOpenStartAnimation());
    },
    () => {
      disaptch(successNotification('Błąd podczas otwierania bramy zdalnie'));
    },
    `stock/open-gate-by-staff/${stockId}`,
    'LOADING',
  );
};
