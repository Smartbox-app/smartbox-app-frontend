import { AccessControl } from '../stock-group';
import { IBase } from '../base/base.interface';
import { IBoxGroup } from '../box/box-entity';

export enum StockPaymentType {
  InAdvance = 'in-advance',
  Installments = 'installments',
  Both = 'both',
}

export interface IStock extends IBase {
  name: string;
  address: string;
  boxGroups: IBoxGroup[];
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
  showGrossPricesToClient: boolean;
  accessControl: AccessControl;
  ksmLogin: string;
  ksmPassword: string;
  ksmLocation: string;
  allowedBoxesCount: number;
  // config whether user wants to pay all in advance or in installments (or if we want to give the user choice)
  clientPaymentTypeConfig: StockPaymentType;
  // days to pay the rent invoice
  daysForPayment: number;
  lat?: string;
  lon?: string;
}

export interface IDiscount extends IBase {
  value: number;
  expireAt: Date;
}

export interface IGate extends IBase {
  ident: string;
  openReq: boolean;
  lastConnection: Date;
  tenantId: string;
  ksmIdentifier: string;
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