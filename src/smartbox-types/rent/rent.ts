import { RentDescription, RentStatus } from './rent-entity';
import { BaseResponse } from '../base/baseRes';
import { Prop } from '../store/prop.decorator';
import { PaymentType } from '../payment';
import { AcceptanceStatuses, SingleAcceptance } from '../addon';
import { AccessControl } from '../stock-group';

export interface OrderAddons {
  [addonId: string]: {
    name: string;
    slug: string;
    price: number | null;
    selectedVariant: string | null;
    selectedVariantName: string | null;
    acceptances: SingleAcceptance[];
    acceptancesStatus: AcceptanceStatuses;
    tax: string;
  }
};

export interface RentBoxReq {
  stockId: string;
  boxGroupId: string;
  startAt: Date;
  finishAt: Date;
  // here always gross price!
  cost: number;

  // here always gross prices!
  orderAddons: OrderAddons;
  discountCode: string;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  postCode: string;
  isCompany: boolean;
  phone: string;
  mailToSendInvoice: string;
  companyName: string;
  companyStreet: string;
  companyCity: string;
  companyPostCode: string;
  nip: string;
  type: PaymentType
}


export interface ExtendRentalReq {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  postCode: string;
  isCompany: boolean;
  phone: string;
  mailToSendInvoice: string;
  companyName?: string;
  companyStreet?: string;
  companyCity?: string;
  companyPostCode?: string;
  nip?: string;
  finishAt: Date;
  cost: number;
  isPaySavedCard: Boolean;
  orderAddons: OrderAddons;
  discountCode: string;
  type: PaymentType
}

export class BoxListItem extends BaseResponse {
  @Prop()
  rentId: string;
  @Prop()
  number: string;
  @Prop()
  size: number;
  @Prop()
  status: RentStatus;
}

export interface ChangeStatusReq {
  boxId: string;
  status: RentStatus;
}

export interface ChangeBoxReq {
  boxNumber: string;
}

export type RentGate = {
  id: string;
  name: string;
  description: string;
  controlled: boolean;
}

export class RentDetailsRes {
  gates?: RentGate[];
  number: string;
  status: RentStatus;
  startAt: Date;
  finishAt: Date;
  owner: RentDetailsUser;
}

export class RentDetailsUser {
  email: string;
  firstName: string;
  lastName: string;
  rentCount: number;
  phone: string;
}

export class MyRentList extends BaseResponse {
  @Prop()
  id: string;
  @Prop()
  status: RentStatus;
  @Prop()
  createdAt: Date;
  @Prop()
  startAt: Date;
  @Prop()
  finishAt: Date;
  @Prop()
  size: number;
  @Prop()
  stockName: string;
  @Prop()
  stockId: string;
  @Prop()
  boxId: string;
  @Prop()
  boxNumber: string;
  @Prop()
  boxAdditionalInfo: string;
  @Prop()
  number: string;
}

export type MyRentDetails = {
  id: string;
  status: RentStatus;
  createdAt: Date;
  startAt: Date;
  finishAt: Date;
  size: number;
  stockName: string;
  stockAddress: string;
  stockId: string;
  boxId: string;
  boxNumber: string;
  boxAdditionalInfo: string;
  number: string;
  gates: RentGate[];
  controlled: boolean;
  isMap: boolean;
  description: RentDescription[];
  accessControl: AccessControl;
}

interface Change {
  newStatus: string;
  oldStatus: string;
  date: Date;
  box: string;
}

export interface WorkerChange extends Change {
  stockName: string
}

export interface StockChange extends Change {
  workerName: string;
}

export class UrlRes extends BaseResponse {
  @Prop()
  url: string;
}


export class HtmlRes extends BaseResponse {
  @Prop()
  html: string;
}
