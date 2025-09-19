export enum NotificationStatus {
  Pending = 'pending',
  Notified = 'notified',
}

export type NotificationEntity = {
  id: string;
  boxGroupId: string;
  userId: string;
  email: boolean;
  sms: boolean;
  tenantId: string;
  status: NotificationStatus;
  createdAt: Date;
};

export type NotificationReq = {
  boxGroupId: string;
  email: boolean;
  sms: boolean;
  tenantId: string;
};
