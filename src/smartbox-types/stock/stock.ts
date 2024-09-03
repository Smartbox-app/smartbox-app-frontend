import { BaseResponse } from '../base/baseRes';
import { Prop } from '../store/prop.decorator';
import { GateHealthCheckStatus } from './gate-health-check-status';
import { AccessControl } from '../stock-group';

export interface DiscountReq {
  value: number;
  expireAt: Date;
}

export interface DiscountList {
  discountId: string;
  stockId: string;
  name: string;
  value: number;
}

export class StockList extends BaseResponse {
  @Prop()
  id: string;
  @Prop()
  name: string;
  @Prop()
  address: string;
}

export class StockDiscountList extends BaseResponse {
  @Prop()
  id: string;
  @Prop()
  name: string;
  @Prop()
  discount: number | null;
  @Prop()
  address: string;
}

export interface StockAdminList {
  id: string;
  name: string;
  address: string;
}

export class GateStatus extends BaseResponse {
  @Prop()
  openReq: boolean;
}

export type GatesStatusForAdminRes = {
  id: string;
  status: GateHealthCheckStatus;
  lastConnection: Date;
  isOpen: boolean;
  stockName: string;
}[];


export interface GateAdminList {
  id: string;
  ident: string;
}

export interface UpdateGateReq {
  moduleId: string;
  moduleVoltage: number;
}

export interface GateAdminReq {
  ident: string;
  lon: string;
  lat: string;
  moduleId: string;
  secondaryModuleId: string;
  ksmIdentifier: string;
  description: string;
}

export interface StockReq {
  name: string;
  address: string;
  stockGroupId?: string;
  tenantId?: string,
  accessControl: AccessControl;
  ksmLogin: string;
  ksmPassword: string;
  ksmLocation: string;
  allowedBoxesCount?: number | null;
}

export interface StockMapReq {
  mapWidth: number;
  mapHeight: number;
  mapWidthMeters: number;
  mapHeightMeters: number;
  mapDefaultScale: number;
}

export interface StockMapFormDataReq {
  mapWidth: string;
  mapHeight: string;
  mapWidthMeters: string;
  mapHeightMeters: string;
  mapDefaultScale: string;
}

export interface StockManageReq {
  name: string;
  address: string;
  tenantId?: string;
  stockGroupId?: string;
  visible: boolean;
  colorReserved: string;
  colorRented: string;
  colorNoPaidExtension: string;
  colorNoPaidExtensionWithWarning: string;
  colorToCheck: string;
  colorToExplain: string;
  colorOutOfService: string;
  colorFinished: string;
  colorFailure: string;
  colorFree: string;
  accessControl: AccessControl;
  ksmLogin: string;
  ksmPassword: string;
  ksmLocation: string;
  allowedBoxesCount?: number | null;
}