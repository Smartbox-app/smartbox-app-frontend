import { CalculatedPriceRes, RentUserData } from 'src/smartbox-types';

export enum RentPaymentType {
  InAdvance = 'in-advance',
  Installments = 'installments',
}

export enum RentAgreementType {
  FixedTerm = 'fixed-term',
  OpenEnded = 'open-ended',
}

export type RentDescriptionAddon = {
  id: string;
  name: string;
  slug: string;
  selectedVariantName: string;
  selectedVariantId: string;
  acceptance?: string;
  accepted: boolean;
  price: string;
  tax: string;
  file?: string;
};

export type PeriodDescriptionAddon = {
  id: string;
  name: string;
  slug: string;
  price: number;
  tax: string;
  selectedVariantId?: string;
};

export interface PeriodDescription {
  price: number;
  tax: string;
  addons: PeriodDescriptionAddon[];
}

export type OpenEndedPeriodPriceItem = {
  id: string;
  name: string;
  price: number;
};

export type OpenEndedNextPeriodPreview = {
  startAt: Date;
  finishAt: Date;
  value: number;
  boxPrice: number;
  currentValue: number;
  priceChanged: boolean;
  addons: OpenEndedPeriodPriceItem[];
};

export interface RentDescription {
  startAt: Date;
  finishAt?: Date;
  cost: number;
  price: CalculatedPriceRes;
  paymentType?: RentPaymentType;
  agreement?: string;
  documentId?: string | null;
  data?: RentUserData;
  addons: RentDescriptionAddon[];
  stockDiscount?: {
    value: number;
  };
}

export enum RentStatus {
  reserved = 'reserved',
  rented = 'rented',
  noPaidExtension = 'noPaidExtension',
  noPaidExtensionWithWarning = 'noPaidExtensionWithWarning',
  toCheck = 'toCheck',
  toExplain = 'toExplain',
  finished = 'finished',
  failure = 'failure',
  noPaidPeriod = 'noPaidPeriod',
  pendingFinish = 'pendingFinish',
  awaitingFinish = 'awaitingFinish',
  endedUnpaid = 'endedUnpaid',
}

export interface RentAuthorizationListQueryRow {
  id: string;
  rentId: string;
  tenantId: string | null;
  email: string;
  phone: string | null;
  boxNumber: string | null;
  startAt: Date | string;
  finishAt: Date | string | null;
}

export interface AdminRentListDetailsQuery {
  id: string;
  userId: string;
  description: string;
  status: RentStatus;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  number: string;
  createdAt: Date;
  startAt: Date;
  finishAt: Date;
  paymentType: RentPaymentType;
  decisionFinishAt: Date | null;
  stockId: string;
  stockName: string;
}

export interface AdminRentListDetails {
  id: string;
  userId: string;
  description: RentDescription[];
  status: RentStatus;
  name: string;
  lastName: string;
  firstName: string;
  email: string;
  number: string;
  createdAt: Date;
  startAt: Date;
  finishAt: Date;
  paymentType: RentPaymentType;
  decisionFinishAt: Date | null;
  stockId: string;
  stockName: string;
}
