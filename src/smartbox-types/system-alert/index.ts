export enum AlertType {
  InvoiceIssue = 'invoice_issue',
  PaymentVerify = 'payment_verify',
}

export enum AlertStatus {
  Open = 'open',
  Read = 'read',
}

export type AlertListItem = {
  id: string;
  type: AlertType;
  message: string;
  status: AlertStatus;
  subjectId: string;
  createdAt: Date;
  updatedAt: Date | null;
};

export type AlertAdminListItem = AlertListItem & {
  tenantId: string | null;
};
