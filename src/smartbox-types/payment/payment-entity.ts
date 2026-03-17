import { IBase } from '../base/base.interface';
import { IExtension } from '../rent';
export enum PaymentStatus {
  wait = 0,
  inProgress = 1,
  succes = 2,
  failure = 3,
  pending = 4,
  accepted = 5,
  canceled = 6,
  chargeback = 7
}
export enum PaymentMethod {
  AutoFirst = 0,
  AutoNext = 1
}

export enum PaymentDocument {
  Invoice = 'invoice',
  Receipt = 'receipt'
}

export enum PaymentType {
  Unset = 'unset',
  NewRent = 'new-rent',
  Extension = 'extension',
  PeriodPayment = 'period-payment'
}

export interface IPayment extends IBase {
  value: number;
  date: Date;
  status: PaymentStatus;
  extension: IExtension;
  isChedckCard: boolean;
  invoiceId: string;
  tpayId: string;
  mailToSendInvoice: string;
  type: PaymentType;
}
