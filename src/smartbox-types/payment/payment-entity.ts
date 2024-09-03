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
export enum PaymentProcessorType {
  Tpay = 0,
  Payu = 1
}
export enum PaymentType {
  card = 0,
  blik = 1,
  transfer = 2
}
export interface PayuResponse {
  req: any;
  res: any;
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
