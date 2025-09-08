import { LocationSelectType } from "../location";
import { DebtResolveType } from "../debt";

export interface TenantEntity {
  id: string;
  name: string;
  identifier: string;
  colorPrimary: string;
  colorSecondary: string;
  logo: string;
  icon: string;
  background: string;
  slides: string[];
  contactPhone: string;
  contactEmail: string;
  fontLight: string;
  fontNormal: string;
  fontBold: string;
  allowedBoxesCount: number;
  allowedStocksCount: number;
  additionalMailInfo: string;
  tax: string;
  invoiceServiceApiKey: string;
  invoiceServiceDomain: string;
  invoiceServiceDepartmentID: string;
  smsName: string;
  smsApiPassword: string;
  smsApiKey: string;
  paymentSystemApiKey: string;
  paymentSystemSecretKey: string;
  rules: string;
  privacy: string;
  agreement: string;
  storeId: string;
  sharedSecret: string;
  allowAddonsToRent: boolean;
  useProd: boolean;
  birthDateNecessary: boolean;
  newRentNotification: boolean;
  rentExtendedNotification: boolean;
  debtResolveType: DebtResolveType;
  locationSelectType: LocationSelectType;
  namingType: NamingType;
}

export type UpdateTenantReq = Pick<
  TenantEntity,
  | 'colorPrimary'
  | 'colorSecondary'
  | 'name'
  | 'identifier'
  | 'contactEmail'
  | 'contactPhone'
  | 'additionalMailInfo'
  | 'tax'
>;
export type UpdateTenantByAdminReq = Pick<
  TenantEntity,
  | 'colorPrimary'
  | 'colorSecondary'
  | 'name'
  | 'identifier'
  | 'contactEmail'
  | 'contactPhone'
  | 'allowedBoxesCount'
  | 'allowedStocksCount'
  | 'additionalMailInfo'
  | 'tax'
  | 'invoiceServiceApiKey'
  | 'invoiceServiceDomain'
  | 'invoiceServiceDepartmentID'
  | 'useProd'
  | 'smsName'
  | 'smsApiKey'
  | 'smsApiPassword'
  | 'paymentSystemApiKey'
  | 'paymentSystemSecretKey'
  | 'storeId'
  | 'sharedSecret'
  | 'allowAddonsToRent'
  | 'newRentNotification'
  | 'rentExtendedNotification'
  | 'birthDateNecessary'
  | 'debtResolveType'
  | 'locationSelectType'
  | 'namingType'
>;
export type TenantForUsers = Omit<
  TenantEntity,
  | 'allowedBoxesCount'
  | 'allowedStocksCount'
  | 'smsApiKey'
  | 'smsApiPassword'
  | 'sharedSecret'
  | 'smsName'
  | 'rules'
  | 'privacy'
  | 'invoiceServiceApiKey'
  | 'invoiceServiceDomain'
  | 'storeId'
  | 'paymentSystemSecretKey'
  | 'paymentSystemApiKey'
  | 'allowAddonsToRent'
>;

export enum NamingType {
    Stock = 'stock',
    Location = 'location'
}