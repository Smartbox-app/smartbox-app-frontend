import { StockListRes } from '../stock/stock-entity';

export interface StockGroupEntity {
  id: string;
  name: string;
  tenantId: string;
  accessControl: AccessControl;
  boxAccessControl: AccessControl;
  gateAccessControl: AccessControl;
  ksmLogin: string;
  ksmPassword: string;
  ksmLocation: string;
}

export type StockGroupData = Omit<
  StockGroupEntity,
  'ksmLogin' | 'ksmPassword' | 'ksmLocation'
>;

export interface StockGroupWithStocks {
  id: string;
  name: string;
  tenantId: string;
  boxAccessControl: AccessControl;
  gateAccessControl: AccessControl;
  // legacy
  accessControl: AccessControl;
  stocks: StockListRes[];
}

export type StockGroupReq = Pick<
  StockGroupEntity,
  | 'name'
  | 'boxAccessControl'
  | 'gateAccessControl'
  | 'ksmLogin'
  | 'ksmPassword'
  | 'ksmLocation'
> & {
  tenantId?: string;
};

export enum AccessControl {
  none = 'none',
  smartbox = 'smartbox',
  ksm = 'ksm',
  ttlock = 'ttlock',
}
