import type { AccessControl } from '../stock-group';

/** Field subset of the backend Stock entity used by StockRes / StockListRes. */
interface Stock {
  id: string;
  accessControl: AccessControl;
  gateAccessControl: AccessControl;
  boxAccessControl: AccessControl;
  address: string;
  clientPaymentTypeConfig: StockPaymentType;
  allowedAgreementType: StockAgreementType;
  openEndedInvoiceDaysBefore: number;
  openEndedDaysForPayment: number;
  openEndedDaysAfterDueToLoseAccess: number;
  openEndedPeriodDays: number;
  colorFailure: string;
  colorFinished: string;
  colorFree: string;
  colorNoPaidExtension: string;
  colorNoPaidExtensionWithWarning: string;
  colorNoPaidPeriod: string;
  colorOutOfService: string;
  colorRented: string;
  colorPendingFinish: string;
  colorReserved: string;
  colorToCheck: string;
  colorToExplain: string;
  isMapActive: boolean;
  lat: string | null;
  lon: string | null;
  mapWidth: number;
  mapHeight: number;
  mapHeightMeters: number;
  mapWidthMeters: number;
  minRentDaysForInstallments: number;
  name: string;
  paymentDocumentConfig: StockPaymentDocument;
  mapBackground: string;
  tenantId: string | null;
}

export enum StockPaymentType {
  InAdvance = 'in-advance',
  Installments = 'installments',
  Both = 'both',
}

export enum StockAgreementType {
  FixedTerm = 'fixed-term',
  OpenEnded = 'open-ended',
  Both = 'both',
}

export enum StockPaymentDocument {
  Invoice = 'invoice',
  Receipt = 'receipt',
  Both = 'both',
}

export type StockRes = Pick<
  Stock,
  | 'id'
  | 'accessControl'
  | 'gateAccessControl'
  | 'boxAccessControl'
  | 'address'
  | 'clientPaymentTypeConfig'
  | 'allowedAgreementType'
  | 'openEndedInvoiceDaysBefore'
  | 'openEndedDaysForPayment'
  | 'openEndedDaysAfterDueToLoseAccess'
  | 'openEndedPeriodDays'
  | 'colorFailure'
  | 'colorFinished'
  | 'colorFree'
  | 'colorNoPaidExtension'
  | 'colorNoPaidExtensionWithWarning'
  | 'colorNoPaidPeriod'
  | 'colorOutOfService'
  | 'colorRented'
  | 'colorPendingFinish'
  | 'colorReserved'
  | 'colorToCheck'
  | 'colorToExplain'
  | 'id'
  | 'isMapActive'
  | 'lat'
  | 'lon'
  | 'mapWidth'
  | 'mapHeight'
  | 'mapHeightMeters'
  | 'mapWidthMeters'
  | 'minRentDaysForInstallments'
  | 'name'
  | 'paymentDocumentConfig'
  | 'mapBackground'
  | 'tenantId'
>;

export type StockListRes = Pick<
  Stock,
  | 'id'
  | 'accessControl'
  | 'boxAccessControl'
  | 'gateAccessControl'
  | 'address'
  | 'name'
  | 'lat'
  | 'lon'
>;

export interface Coordinate {
  lat: string;
  lon: string;
}
