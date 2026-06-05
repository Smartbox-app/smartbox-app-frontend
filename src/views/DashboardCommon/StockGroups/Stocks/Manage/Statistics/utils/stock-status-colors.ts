import { StatsByStatus, StockRes } from 'smartbox-types';

export type StockStatusColors = Record<keyof StatsByStatus, string>;

export const STATUS_STATS_KEYS: (keyof StatsByStatus)[] = [
  'free',
  'rented',
  'reserved',
  'noPaidExtension',
  'noPaidPeriod',
  'toCheck',
  'toExplain',
  'outOfService',
];

/** Box status colors configured per stock (tenant location settings). */
export const getStockStatusColors = (
  stock: Pick<
    StockRes,
    | 'colorFree'
    | 'colorRented'
    | 'colorReserved'
    | 'colorNoPaidExtension'
    | 'colorNoPaidPeriod'
    | 'colorToCheck'
    | 'colorToExplain'
    | 'colorOutOfService'
  >,
): StockStatusColors => ({
  free: stock.colorFree,
  rented: stock.colorRented,
  reserved: stock.colorReserved,
  noPaidExtension: stock.colorNoPaidExtension,
  noPaidPeriod: stock.colorNoPaidPeriod,
  toCheck: stock.colorToCheck,
  toExplain: stock.colorToExplain,
  outOfService: stock.colorOutOfService,
});
