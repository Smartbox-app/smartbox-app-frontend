export type MobileConfigType =
  | 'web'
  | 'ios_review'
  | 'ios'
  | 'android'
  | 'android_review'
  | 'ios_maintenance'
  | 'android_maintenance'

export interface MobileConfigEntity {
  id: string;
  type: MobileConfigType;
  value: string;
  appId: string;
}

export interface MobileConfigDetails {
  id: string;
  type: MobileConfigType;
  value: string;
  appId: string;
}

export interface MobileConfigListDetails {
  id: string;
  type: string;
  value: string;
  appId: string;
}

export interface MobileConfigReq {
  type: MobileConfigType;
  value: string;
  appId: string;
}

export interface MobileAppConfigResponse {
  versions: string[];
  isMaintenance: boolean;
  /** Platform-specific + shared mobile messages (non-empty only). */
  messages: string[];
}
