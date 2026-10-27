import { AccessControl } from 'src/smartbox-types/stock-group';
import { AlarmHealthCheckStatus } from 'src/smartbox-types/stock/alarm-health-check-status';
import { GateHealthCheckStatus } from 'src/smartbox-types/stock/gate-health-check-status';
import { PriceDisplayForClients } from 'src/smartbox-types/stock/price-display-for-clients';
import {
  StockAgreementType,
  StockPaymentDocument,
  StockPaymentType,
} from 'src/smartbox-types/stock/stock-entity';

export interface DiscountReq {
  value: number;
  startAt?: Date | null;
  expireAt: Date;
}

export interface DiscountList {
  discountId: string;
  stockId: string;
  name: string;
  value: number;
  startAt: Date | null;
  expireAt: Date;
}

export class StockList {
  id: string;
  name: string;
  address: string;

  lat?: string;
  lon?: string;
}

export class StockDiscountList {
  id: string;
  name: string;
  discount: number | null;
  address: string;
}

export interface StockAdminList {
  id: string;
  name: string;
  address: string;
}

export class GateStatus {
  openReq: boolean;
}

export type SingleGateRes = {
  id: string;
  status: GateHealthCheckStatus;
  lastConnection: Date;
  isOpen?: boolean;
  stockName: string;
  accessControl?: AccessControl;
};

export type GatesStatusForAdminRes = SingleGateRes[];

export type SingleAlarmRes = {
  id: string;
  name: string;
  status: AlarmHealthCheckStatus;
  lastConnection: Date;
  stockName: string;
  alarmState: 'armed' | 'disarmed' | 'unknown';
};

export type AlarmsStatusForAdminRes = SingleAlarmRes[];

export type LocationDiagnosticsWanState = 'primary' | 'lte' | 'unknown';

export type LocationDiagnosticsStatus = 'ok' | 'degraded' | 'down';

export type LocationDiagnosticsBusDeviceKind = 'master' | 'slave' | 'elog';

export type LocationDiagnosticsWan = {
  state: LocationDiagnosticsWanState;
  changedAt: Date | null;
};

export type LocationDiagnosticsBusDevice = {
  kind: LocationDiagnosticsBusDeviceKind;
  master: string;
  unit: number | null;
  covers: string[];
  answering: boolean | null;
  lastAnsweredAt: Date | null;
};

export type LocationDiagnosticsRes = {
  locationId: number;
  status: LocationDiagnosticsStatus;
  asOf: Date | null;
  lastContactAt: Date | null;
  wan: LocationDiagnosticsWan;
  bus: LocationDiagnosticsBusDevice[] | null;
} | null;

export interface GateAdminList {
  id: string;
  ident: string;
  passcode?: string;
  hasKeypad?: boolean;
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
  ksmAlarmIdentifier: string;
  ttlockIdentifier: string;
  keylessboxIdentifier: string;
  hasKeypad?: boolean;
  description: string;
}

export interface StockReq {
  name: string;
  address: string;
  stockGroupId?: string;
  tenantId?: string;
  boxAccessControl: AccessControl;
  gateAccessControl: AccessControl;
  ksmLogin: string;
  ksmPassword: string;
  ksmLocation: string;
  keylessboxLocation?: number | null;
  allowedBoxesCount?: number | null;
}

/** POST stock — fields from stock/form/add. */
export interface StockCreateReq {
  name: string;
  address?: string;
  lat?: string;
  lon?: string;
  visible?: boolean;
  isMapActive?: boolean;
  priceDisplayForClients: PriceDisplayForClients;
  daysForPayment?: number | '';
  clientPaymentTypeConfig?: StockPaymentType;
  paymentDocumentConfig?: StockPaymentDocument;
  minRentDaysForInstallments?: number | null;
  allowedBoxesCount?: number | null;
  boxAccessControl: AccessControl;
  gateAccessControl: AccessControl;
  ksmLogin: string;
  ksmPassword: string;
  ksmLocation: string;
  keylessboxLocation?: number | null;
  invoiceServiceDepartmentID?: string;
  stockGroupId?: string | null;
  tenantId?: string;
}

/** PATCH stock/:id/basic — fields from stock/form/basic. */
export interface StockBasicReq {
  name: string;
  address?: string;
  lat?: string;
  lon?: string;
  visible?: boolean;
  isMapActive?: boolean;
  colorFree: string;
  colorReserved: string;
  colorRented: string;
  colorFinished: string;
  colorFailure: string;
  colorToCheck: string;
  colorToExplain: string;
  colorOutOfService: string;
  colorNoPaidExtension: string;
  colorNoPaidPeriod: string;
  colorNoPaidExtensionWithWarning: string;
  colorPendingFinish?: string;
  allowedBoxesCount?: number | null;
  activeBoxesCount?: number | null;
  boxAccessControl: AccessControl;
  gateAccessControl: AccessControl;
  ksmLogin: string;
  ksmPassword: string;
  ksmLocation: string;
  keylessboxLocation?: number | null;
  stockGroupId?: string | null;
}

/** PATCH stock/:id/agreements — fields from stock/form/agreements. */
export interface StockAgreementsReq {
  allowedAgreementType: StockAgreementType;
  openEndedPeriodDays: number;
  openEndedInvoiceDaysBefore: number;
  openEndedDaysForPayment: number;
  openEndedDaysAfterDueToLoseAccess: number;
  priceDisplayForClients: PriceDisplayForClients;
  clientPaymentTypeConfig: StockPaymentType;
  daysForPayment: number;
  paymentDocumentConfig?: StockPaymentDocument;
  minRentDaysForInstallments?: number | null;
  invoiceServiceDepartmentID?: string;
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
  colorPendingFinish?: string;
  colorNoPaidExtension: string;
  colorNoPaidPeriod: string;
  colorNoPaidExtensionWithWarning: string;
  colorToCheck: string;
  colorToExplain: string;
  colorOutOfService: string;
  colorFinished: string;
  colorFailure: string;
  colorFree: string;
  boxAccessControl: AccessControl;
  gateAccessControl: AccessControl;
  priceDisplayForClients: PriceDisplayForClients;
  ksmLogin: string;
  ksmPassword: string;
  ksmLocation: string;
  keylessboxLocation?: number | null;
  allowedBoxesCount?: number | null;
}

export type StatsByStatus = {
  free: number;
  reserved: number;
  rented: number;
  pendingFinish: number;
  toCheck: number;
  toExplain: number;
  noPaidExtension: number;
  noPaidPeriod: number;
  outOfService: number;
};

export type StatsByGroup = {
  name: string;
  area: number;
  totalCount: number;
  byStatus: StatsByStatus;
};

export type GroupStats = {
  [groupId: string]: StatsByGroup;
};

export type StockStatistics = {
  totalCount: number;
  byStatus: StatsByStatus;
  byGroup: GroupStats;
  incomeByMonth: {
    [month: string]: {
      amount: number;
      order: number;
    };
  };
};
