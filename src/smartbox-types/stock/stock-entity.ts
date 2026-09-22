import { IBase } from '../base/base.interface';
import { AccessControl } from '../stock-group';

export enum StockPaymentType {
  InAdvance = 'in-advance',
  Installments = 'installments',
  Both = 'both',
}

export enum StockPaymentDocument {
  Invoice = 'invoice',
  Receipt = 'receipt',
  Both = 'both',
}

export interface IStock extends IBase {
  name: string;
  address: string;
  gate: IGate;
  discount: IDiscount;
  map: string;
  visible: boolean;
  isMapActive: boolean;
  mapBackground: string;
  mapWidth: number;
  mapHeight: number;
  mapWidthMeters: number;
  mapHeightMeters: number;
  mapDefaultScale: number;
  tenantId: string;
  stockGroupId?: string;
  colorReserved: string;
  colorRented: string;
  colorNoPaidExtension: string;
  colorNoPaidPeriod: string;
  colorNoPaidExtensionWithWarning: string;
  colorToCheck: string;
  colorToExplain: string;
  colorOutOfService: string;
  colorFinished: string;
  colorFailure: string;
  colorFree: string;
  colorPendingFinish: string;
  showGrossPricesToClient: boolean;
  accessControl: AccessControl;
  gateAccessControl: AccessControl;
  boxAccessControl: AccessControl;
  ksmLogin: string;
  ksmPassword: string;
  ksmLocation: string;
  allowedBoxesCount: number;
  activeBoxesCount: number;
  // config whether user wants to pay all in advance or in installments (or if we want to give the user choice)
  clientPaymentTypeConfig: StockPaymentType;
  paymentDocumentConfig: StockPaymentDocument;
  // days to pay the rent invoice
  daysForPayment: number;
  minRentDaysForInstallments: number | null;
  lat?: string;
  lon?: string;
  invoiceServiceDepartmentID?: string;
}

export type StockRes = Pick<
  IStock,
  | 'id'
  | 'accessControl'
  | 'gateAccessControl'
  | 'boxAccessControl'
  | 'address'
  | 'clientPaymentTypeConfig'
  | 'colorFailure'
  | 'colorFinished'
  | 'colorFree'
  | 'colorNoPaidExtension'
  | 'colorNoPaidExtensionWithWarning'
  | 'colorNoPaidPeriod'
  | 'colorOutOfService'
  | 'colorRented'
  | 'colorReserved'
  | 'colorToCheck'
  | 'colorToExplain'
  | 'colorPendingFinish'
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
  IStock,
  | 'id'
  | 'accessControl'
  | 'boxAccessControl'
  | 'gateAccessControl'
  | 'address'
  | 'name'
  | 'lat'
  | 'lon'
>;

export interface IDiscount extends IBase {
  value: number;
  expireAt: Date;
}

export interface IGate extends IBase {
  ident: string;
  openReq: boolean;
  lastConnection: Date;
  tenantId: string;
  ksmIdentifier?: string;
  ttlockIdentifier?: string;
}

export interface Coordinate {
  lat: string;
  lon: string;
}

export interface IReading {
  date: Date;
  moduleId: string;
  moduleVoltage: number;
}
