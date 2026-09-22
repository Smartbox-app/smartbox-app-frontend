import { ApiErrorCode } from "../apiMessages";

export enum KsmGateOpenRequestStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  CONFIRMING_ALARM = 'confirming_alarm',
  OPENING = 'opening',
  SUCCESS = 'success',
  FAILED = 'failed',
}

export interface KsmGateOpenRequestRes {
  id: string;
  gateId: string;
  status: KsmGateOpenRequestStatus;
  errorCode: ApiErrorCode | null;
  errorDetails: string | null;
  expectedAlarmState: string | null;
  actualAlarmState: string | null;
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date | null;
}
