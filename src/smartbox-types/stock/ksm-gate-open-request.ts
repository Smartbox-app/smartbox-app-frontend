export enum KsmGateOpenRequestStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  CONFIRMING_ALARM = 'confirming_alarm',
  OPENING = 'opening',
  SUCCESS = 'success',
  FAILED = 'failed',
}

export class KsmGateOpenRequestRes {
  id: string;

  gateId: string;

  status: KsmGateOpenRequestStatus;

  errorCode: number | null;

  errorDetails: string | null;

  expectedAlarmState: string | null;

  actualAlarmState: string | null;

  createdAt: Date;

  updatedAt: Date;

  completedAt: Date | null;
}
