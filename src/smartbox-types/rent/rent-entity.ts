import { IBase } from '../base/base.interface';
import { IUser } from '../user';
import { IPayment } from '..';

export interface RentDescription {
  startAt: string;
  finishAt: string;
  cost: string;
  price: string;
  addons: {
    id: string;
    name: string;
    selectedVariantName: string;
    selectedVariantId: string;
    acceptance?: string;
    accepted: boolean;
    price: string;
  }[]
}

export interface IRent extends IBase {
  number: string;
  status: RentStatus;
  startAt: Date;
  finishAt: Date;
  owner: IUser;
  payments: IPayment[]
  isCompany: boolean;
  decisionFinishAt: Date;
  createdAt: Date;
  description: RentDescription[];
}

export interface IExtension extends IBase {
  to: Date;
  payment: IPayment;
  expirationAt: Date;
  description: RentDescription;
}

export enum RentStatus {
  reserved = 'zarezerwowany',
  rented = 'wynajęty',
  noPaidExtension = 'nieopłacone przedłużenie',
  noPaidExtensionWithWarning = 'nieopłacone przedłużenie z wykrzyknikiem',
  toCheck = 'do sprawdzenia',
  toExplain = 'do wyjaśnienia',
  outOfService = 'wyłączony z użytku',
  finished = 'zakończone',
  failure = 'zakończone bez wynajęcia',
  free = 'wolny',
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
}

export interface AdminRentListDetails {
  id: string;
  userId: string;
  description: RentDescription[];
  status: RentStatus;
  name: string;
  lastName: string;
  email: string;
  number: string;
  createdAt: Date;
  startAt: Date;
  finishAt: Date;
}