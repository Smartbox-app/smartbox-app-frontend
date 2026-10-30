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
  updatedAt: Date | null;
};

export type QueryBuilderSystemNotification = {
    id: string;
  email: string;
  phone: string;
  sendSms: boolean;
  sendEmail: boolean;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date | null;
  status: NotificationStatus;
  box: string;
};
