import { DebtResolveType } from 'src/smartbox-types/debt';
import { LocalizedStringMap } from 'src/smartbox-types/i18n';
import { LocationSelectType } from 'src/smartbox-types/location';
import { AccountConfirmationMethod } from 'src/smartbox-types/tenant/account-confirmation-method';

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
  allowMultipleCompanies: boolean;
  useProd: boolean;
  birthDateNecessary: boolean;
  clientSourceField: boolean;
  requireEndRentPhoto: boolean;
  allowFinishGracePeriod: boolean;
  newRentNotification: boolean;
  rentExtendedNotification: boolean;
  rentEndedNotification: boolean;
  accountConfirmationMethod: AccountConfirmationMethod;
  debtResolveType: DebtResolveType;
  locationSelectType: LocationSelectType;
  namingType: NamingType;
  agreementDisclaimer: string;
  agreementDisclaimerI18n: LocalizedStringMap;
  paymentDisclaimer: string;
  paymentDisclaimerI18n: LocalizedStringMap;
  homeMessage: string;
  homeMessageI18n: LocalizedStringMap;
  mobileAppAndroidLink: string | null;
  mobileAppIosLink: string | null;
  showPwaBannerAndroid: boolean;
  showPwaBannerIos: boolean;
  systemMessage: string;
  systemMessageI18n: LocalizedStringMap;
  useCustomSmtp: boolean;
  smtpHost: string | null;
  smtpPort: number | null;
  smtpUser: string | null;
  smtpPassword: string | null;
  smtpSecure: boolean;
  smtpIgnoreTls: boolean;
  smtpFromEmail: string | null;
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
  | 'allowAddonsToRent'
  | 'allowMultipleCompanies'
  | 'accountConfirmationMethod'
  | 'birthDateNecessary'
  | 'clientSourceField'
  | 'locationSelectType'
  | 'namingType'
>;
export type UpdateTenantAgreementsReq = Pick<
  TenantEntity,
  | 'requireEndRentPhoto'
  | 'allowFinishGracePeriod'
  | 'debtResolveType'
  | 'useProd'
>;
export type UpdateTenantAgreementsByAdminReq = UpdateTenantAgreementsReq;
export type UpdateTenantIntegrationsReq = Pick<
  TenantEntity,
  | 'smsName'
  | 'smsApiKey'
  | 'smsApiPassword'
  | 'paymentSystemApiKey'
  | 'paymentSystemSecretKey'
  | 'storeId'
  | 'sharedSecret'
>;
export type UpdateTenantMessagingReq = Pick<
  TenantEntity,
  | 'agreementDisclaimer'
  | 'paymentDisclaimer'
  | 'homeMessage'
  | 'systemMessage'
> &
  Partial<
    Pick<
      TenantEntity,
      | 'agreementDisclaimerI18n'
      | 'paymentDisclaimerI18n'
      | 'homeMessageI18n'
      | 'systemMessageI18n'
    >
  > &
  Record<string, unknown>;
export type UpdateTenantCommunicationsReq = UpdateTenantMessagingReq &
  Pick<
    TenantEntity,
    | 'newRentNotification'
    | 'rentExtendedNotification'
    | 'rentEndedNotification'
  >;
export type UpdateTenantMobileAppsReq = Pick<
  TenantEntity,
  | 'mobileAppAndroidLink'
  | 'mobileAppIosLink'
  | 'showPwaBannerAndroid'
  | 'showPwaBannerIos'
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
  | 'allowAddonsToRent'
  | 'useCustomSmtp'
  | 'smtpHost'
  | 'smtpPort'
  | 'smtpUser'
  | 'smtpPassword'
  | 'smtpSecure'
  | 'smtpIgnoreTls'
  | 'smtpFromEmail'
  | 'agreementDisclaimerI18n'
  | 'paymentDisclaimerI18n'
  | 'homeMessageI18n'
  | 'systemMessageI18n'
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

export type SmsPlanetConnectionResponse =
  | { errorMsg: string }
  | { senderFields: string };

export { AccountConfirmationMethod } from 'src/smartbox-types/tenant/account-confirmation-method';

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
