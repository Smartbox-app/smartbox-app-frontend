import { LocalizedStringMap } from 'src/smartbox-types/i18n';

export interface AppSettingsEntity {
  invoiceDescription: string;
  tax: string;
  version: string;
  webMessage: string;
  webMessageI18n: LocalizedStringMap;
  androidMessage: string;
  androidMessageI18n: LocalizedStringMap;
  iosMessage: string;
  iosMessageI18n: LocalizedStringMap;
  mobileMessage: string;
  mobileMessageI18n: LocalizedStringMap;
}

export interface AppVersionResponse {
  version: string;
  message: string;
}

export type UpdateSettingsReq = Pick<
  AppSettingsEntity,
  'version' | 'webMessage' | 'androidMessage' | 'iosMessage' | 'mobileMessage'
> &
  Partial<
    Pick<
      AppSettingsEntity,
      | 'webMessageI18n'
      | 'androidMessageI18n'
      | 'iosMessageI18n'
      | 'mobileMessageI18n'
    >
  > &
  Record<string, unknown>;
