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

export interface TTLockDevice {
  lockId: number;
  lockName: string;
  lockAlias?: string;
  electricQuantity: number;
  lockMac: string;
  lockVersion: string;
  specialValue?: number;
  groupId?: number;
  groupName?: string;
  date: number;
}

export type TTLockDeviceList = Pick<TTLockDevice, 'lockId' | 'lockName' | 'lockAlias' | 'electricQuantity'>

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
