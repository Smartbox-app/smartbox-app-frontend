import { RentAgreementType, RentPaymentType } from 'src/smartbox-types/rent';

export type ClientDeadlinePeriod = {
  id: string;
  paid: boolean;
  invoiceId: string;
  startAt: Date;
  paymentTo: Date;
  agreementType: RentAgreementType;
  paymentType: RentPaymentType;
  rentNumber: string;
  stockDaysForPayment: number | null;
  stockOpenEndedDaysForPayment: number | null;
  stockInvoiceDaysBefore: number | null;
};

export type PaymentDeadlinePeriodChange = {
  rentNumber: string;
  agreementType: RentAgreementType;
  startAt: Date;
  paymentTo: Date;
  nextPaymentTo: Date;
};

export type PaymentDeadlineChange = {
  label: string;
  previousDays: number | null;
  nextDays: number | null;
  periods: PaymentDeadlinePeriodChange[];
};

export type PaymentDeadlineUpdate = {
  id: string;
  paymentTo: Date;
};

export type DeadlineDays = {
  previous: number | null;
  next: number | null;
};

export type MovedPeriod = {
  period: ClientDeadlinePeriod;
  nextPaymentTo: Date;
};

export type ClientPaymentDeadlineResult = {
  changes: PaymentDeadlineChange[];
  updates: PaymentDeadlineUpdate[];
};
