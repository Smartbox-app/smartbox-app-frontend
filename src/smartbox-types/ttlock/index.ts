export interface TTLockAuthResponse {
  access_token: string;
  refresh_token: string;
  uid: number;
  scope: string;
  token_type: string;
  expires_in: number;
}

export interface TTLockListResponse {
  list: TTLockDevice[];
  pageNo: number;
  pages: number;
  total: number; // total number of locks
}

export interface TTGatewayLockListResponse {
  list: TTGatewayLockDevice[];
  pageNo: number;
  pages: number;
  total: number; // total number of locks
}

export interface TTLockDevice {
  lockId: number;
  lockName: string;
  lockAlias?: string;
  electricQuantity: number;
  lockMac: string;
  lockVersion: string;
  groupId?: number;
  groupName?: string;
  date: number;
  specialValue?: number;
}

export type TTLockDeviceDetails = {
  lockId: number;
  lockName: string;
  lockAlias?: string;
  lockMac: string;
  electricQuantity: number;
  specialValue?: number;
  autoLockTime: number;
  isFrozen: number;
  privacyLock: number;
  tamperAlert: number;
  resetButton: number;
  hasGateway: number;
  noKeyPwd: string;
};

export interface TTGatewayLockDevice {
  lockId: number;
  lockName: string;
  lockAlias?: string;
  electricQuantity: number;
  lockMac: string;
  rssi: number;
}

export type TTLockDeviceList = Pick<
  TTLockDevice,
  'lockId' | 'lockName' | 'lockAlias' | 'electricQuantity'
>;

export type TTGatewayLockDeviceList = Pick<
  TTGatewayLockDevice,
  'lockId' | 'lockName' | 'lockAlias' | 'electricQuantity' | 'rssi'
>;

export interface TTLockUnlockResponse {
  errcode?: number;
  errmsg?: string;
  description?: string;
  /** 0 means success */ success?: boolean;
}

export interface TTLockKeyboardPwdResponse {
  keyboardPwdId: number;
  keyboardPwd: string;
  startDate: number;
  endDate: number;
  errcode?: number;
  errmsg?: string;
}

export interface TTLockGroup {
  groupId: number;
  name: string;
  lockNum: number;
  date: number; // timestamp of group creation or last update
}

export interface TTLockGroupListResponse {
  list: TTLockGroup[];
  pageNo: number;
  pages: number;
  total: number;
}

export interface TTLockGateway {
  gatewayId: number;
  gatewayName: string;
  gatewayMac: string;
  networkName: string;
  networkMac: string;
  lockNum: number;
  isOnline: number;
  date: number; // timestamp of group creation or last update
}

export interface TTLockGatewayListResponse {
  list: TTLockGateway[];
  pageNo: number;
  pages: number;
  total: number;
}

export interface TTLockPasscode {
  keyboardPwdId: string;
  lockId: string;
  keyboardPwd: string;
  keyboardPwdName: string;
  startDate: number;
  endDate: number;
  /** True when this code is the rent passcode and must be rotated, not deleted. */
  assignedToRent?: boolean;
}

export interface TTLockPasscodeListResponse {
  list: TTLockPasscode[];
  pageNo: number;
  pages: number;
  total: number;
}

export interface TTLockPasscodeReq {
  passcode: string;
  name: string;
  startDate?: Date;
  endDate?: Date;
}
