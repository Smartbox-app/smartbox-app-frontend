import { LocationSelectType } from '../location';
import { DebtResolveType } from '../debt';
import { AccountConfirmationMethod } from './account-confirmation-method';

export { AccountConfirmationMethod } from './account-confirmation-method';

export interface  TenantEntity {
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
  allowMultipleCompanies: boolean;
  useProd: boolean;
  birthDateNecessary: boolean;
  clientSourceField: boolean;
  requireEndRentPhoto: boolean;
  newRentNotification: boolean;
  rentExtendedNotification: boolean;
  debtResolveType: DebtResolveType;
  locationSelectType: LocationSelectType;
  namingType: NamingType;
  agreementDisclaimer: string;
  paymentDisclaimer: string;
  homeMessage: string;
  systemMessage: string;
  mobileAppAndroidLink: string | null;
  mobileAppIosLink: string | null;
  useCustomSmtp: boolean;
  smtpHost: string | null;
  smtpPort: number | null;
  smtpUser: string | null;
  smtpPassword: string | null;
  smtpSecure: boolean;
  smtpIgnoreTls: boolean;
  smtpFromEmail: string | null;
  accountConfirmationMethod: AccountConfirmationMethod;
  publicAssetsBaseUrl: string;
  allowFinishGracePeriod: boolean;
  gtmId: string | null;
  metaPixelId: string | null;
  active: boolean;
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
  | 'allowMultipleCompanies'
  | 'newRentNotification'
  | 'rentExtendedNotification'
  | 'birthDateNecessary'
  | 'clientSourceField'
  | 'requireEndRentPhoto'
  | 'debtResolveType'
  | 'locationSelectType'
  | 'namingType'
  | 'accountConfirmationMethod'
>;
export type UpdateTenantMessagingReq = Pick<
  TenantEntity,
  | 'agreementDisclaimer'
  | 'paymentDisclaimer'
  | 'homeMessage'
  | 'systemMessage'
>;
export type UpdateTenantMobileAppsReq = Pick<
  TenantEntity,
  'mobileAppAndroidLink' | 'mobileAppIosLink'
>;
export type UpdateTenantAnalyticsReq = Pick<
  TenantEntity,
  'gtmId' | 'metaPixelId'
>;

export type TenantForUsers = Omit<
  TenantEntity,
  | 'allowedBoxesCount'
  | 'allowedStocksCount'
  | 'smsApiKey'
  | 'smsApiPassword'
  | 'sharedSecret'
  | 'smsName'
  | 'invoiceServiceApiKey'
  | 'invoiceServiceDomain'
  | 'storeId'
  | 'paymentSystemSecretKey'
  | 'paymentSystemApiKey'
  | 'useCustomSmtp'
  | 'smtpHost'
  | 'smtpPort'
  | 'smtpUser'
  | 'smtpPassword'
  | 'smtpSecure'
  | 'smtpIgnoreTls'
  | 'smtpFromEmail'
> & {
  smsAvailable: boolean;
  /** Resolved method used for new registrations (falls back to email when SMS is not configured). */
  accountConfirmationMethodEffective: AccountConfirmationMethod;
  links: { id: string; name: string; fileName: string }[];
  publicAssetsBaseUrl: string;
};

export type TenantForClients = TenantForUsers & {
  hasApiAccess: boolean;
};

export enum NamingType {
  Stock = 'stock',
  Location = 'location',
}

export type TenantSmtpConfig = Pick<
  TenantEntity,
  | 'useCustomSmtp'
  | 'smtpHost'
  | 'smtpPort'
  | 'smtpUser'
  | 'smtpPassword'
  | 'smtpSecure'
  | 'smtpIgnoreTls'
  | 'smtpFromEmail'
>;
