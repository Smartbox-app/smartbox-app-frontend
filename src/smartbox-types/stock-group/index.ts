import { StockListRes } from "src/smartbox-types/stock/stock-entity";

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
    keylessboxLocation: number | null;
}

export type StockGroupData = Omit<StockGroupEntity, 'ksmLogin' | 'ksmPassword' | 'ksmLocation' | 'keylessboxLocation'>;

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

export type StockGroupReq = Pick<StockGroupEntity, 'name' | 'boxAccessControl' | 'gateAccessControl' | 'ksmLogin' | 'ksmPassword' | 'ksmLocation' | 'keylessboxLocation'> & {
    tenantId?: string;
};

export enum AccessControl {
    none = 'none',
    smartbox = 'smartbox',
    keylessbox = 'keylessbox',
    ksm = 'ksm',
    ttlock = 'ttlock'
}