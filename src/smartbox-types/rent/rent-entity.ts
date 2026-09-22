import { IBase } from '../base/base.interface';
import { IUser } from '../user';
import { CalculatedPriceRes, IPayment, RentUserData } from '..';

export enum RentPaymentType {
  InAdvance = 'in-advance',
  Installments = 'installments',
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
};

export interface RentDescription {
  startAt: Date;
  finishAt: Date;
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

export interface IRent extends IBase {
  number: string;
  status: RentStatus;
  startAt: Date;
  finishAt: Date;
  owner: IUser;
  payments: IPayment[];
  isCompany: boolean;
  decisionFinishAt: Date;
  createdAt: Date;
  description: RentDescription[];
  data: RentUserData;
  agreementFile: string;
  paymentType: RentPaymentType;
  previousRentId?: string;
}

export interface IExtension extends IBase {
  createdAt: Date;
  to: Date;
  payment: IPayment;
  expirationAt: Date;
  description: RentDescription;
  paymentType: RentPaymentType;
  cost: number;
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
}

export interface AdminRentListDetailsQuery {
  id: string;
  userId: string;
  description: string;
  status: RentStatus;
  name: string;
  lastName: string;
  email: string;
  number: string;
  createdAt: Date;
  startAt: Date;
  finishAt: Date;
  paymentType: RentPaymentType;
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
