import { RentDescription, RentPaymentType, RentStatus } from './rent-entity';
import { BoxStatus } from '../box/box-entity';
import { BaseResponse } from '../base/baseRes';
import { Prop } from '../store/prop.decorator';
import {
  CompanyData,
  PaymentDocument,
  PaymentStatus,
} from '../payment';
import { AcceptanceStatuses, SingleAcceptance } from '../addon';
import { PeriodEntity } from '../period';

export interface OrderAddons {
  [addonId: string]: {
    price: number | null;
    selectedVariant: string | null;
    selectedVariantName: string | null;
    acceptances: SingleAcceptance[];
    acceptancesStatus: AcceptanceStatuses;
  };
}

export interface RentBoxFormDataReq {
  stockId: string;
  boxGroupId: string;
  startAt: string;
  finishAt: string;
  // here always gross price!
  cost: string;

  // here always gross prices!
  orderAddons: string;
  discountCode: string;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  country: string;
  postCode: string;
  isCompany: string;
  phone: string;
  mailToSendInvoice: string;
  companyName: string;
  companyStreet: string;
  companyCity: string;
  companyPostCode: string;
  companyCountry: string;
  nip: string;
  type: string;
  rentPaymentType: RentPaymentType;
  paymentDocument: PaymentDocument;
  birthDate?: string;
}

export interface RentBoxReq {
  stockId: string;
  boxGroupId: string;
  startAt: string;
  finishAt: string;

  // here always gross price!
  cost: number;

  // here always gross prices!
  orderAddons: OrderAddons;
  discountCode: string;
  firstName: string;
  lastName: string;
  street: string;
  birthDate?: Date;
  clientSource?: string;
  city: string;
  country: string;
  postCode: string;
  isCompany: boolean;
  phone: string;
  mailToSendInvoice: string;
  companyName: string;
  companyStreet: string;
  companyCity: string;
  companyPostCode: string;
  companyCountry: string;
  nip: string;

  rentPaymentType: RentPaymentType;
  paymentDocument: PaymentDocument;
}

export interface ExtendRentalFormDataReq {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  postCode: string;
  country: string;
  isCompany: string;
  phone: string;
  mailToSendInvoice: string;
  companyName?: string;
  companyStreet?: string;
  companyCity?: string;
  companyPostCode?: string;
  companyCountry?: string;
  nip?: string;
  finishAt: string;
  cost: string;
  orderAddons: string;
  discountCode: string;
  type: string;
  birthDate?: string;
  rentPaymentType: RentPaymentType;
  paymentDocument: PaymentDocument;
}

export interface ExtendRentalReq {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  postCode: string;
  country: string;
  isCompany: boolean;
  phone: string;
  mailToSendInvoice: string;
  companyName?: string;
  companyStreet?: string;
  companyCity?: string;
  companyPostCode?: string;
  companyCountry?: string;
  nip?: string;
  finishAt: string;
  cost: number;
  orderAddons: OrderAddons;
  discountCode: string;
  birthDate?: Date;
  rentPaymentType: RentPaymentType;
  paymentDocument: PaymentDocument;
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

export type ChangeableBoxStatus = BoxStatus.free | BoxStatus.outOfService;

export interface ChangeStatusReq {
  boxId: string;
  status: RentStatus | ChangeableBoxStatus;
}

export interface ChangeBoxReq {
  boxNumber: string;
}

export type RentGate = {
  id: string;
  name: string;
  description: string;
  controlled: boolean;
  passcode?: string;
  version?: number;
};

export class RentDetailsRes {
  gates?: RentGate[];
  id: string;
  number: string;
  size?: string;
  status: RentStatus;
  createdAt: Date;
  startAt: Date;
  finishAt: Date;
  decisionFinishAt: Date;
  owner: RentDetailsUser;
  periods: PeriodEntity[];
  description: RentDescription[];
  paymentType: RentPaymentType;
  isAuthorized: boolean;
  endRentPhoto?: string | null;
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
  decisionFinishAt: Date;
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

/** Add co-user to a rent: exactly one of email or phone (registered tenant user). */
export type AddRentAuthorizedUserReq = {
  email?: string;
  phone?: string;
};

export type RentAuthorizedUserSummary = {
  authorizationId: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
};

export type RentAuthorizationListItem = {
  id: string;
  rentId: string;
  email: string;
  phone: string;
  boxNumber: string;
  startAt: Date;
  finishAt: Date | null;
};

export type CreateStaffRentAuthorizationReq = {
  rentId: string;
} & AddRentAuthorizedUserReq;

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
  boxGroupId: string;
  boxNumber: string;
  boxAdditionalInfo: string;
  number: string;
  gates: RentGate[];
  controlled: boolean;
  isMap: boolean;
  description: RentDescription[];
  periods: PeriodEntity[];
  pendingPayments: boolean;
  paymentType: RentPaymentType;
  passcode: string | null;
  /** True when the current user accesses this rent as an authorized co-user (not the contract owner). */
  isAuthorized?: boolean;
};

interface Change {
  newStatus: string;
  oldStatus: string;
  date: Date;
  box: string;
}

export interface WorkerChange extends Change {
  stockName: string;
}

export interface StockChange extends Change {
  workerName: string;
}

export type RentUserData = CompanyData & {
  id: string;
  street: string;
  city: string;
  postCode: string;
  country: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: Date | string;
  clientSource?: string;
  stockName: string;
  stockAddress: string;
  size: string;
  boxNumber?: string;
  mailToSendInvoice: string;
  isCompany: boolean;
  date: Date;
  area?: number;
};

export type AssignRentReq = {
  userId: string;
  boxId: string;
  stockId: string;
  startAt: string;
  finishAt: string;
};

export type GeneratePaymentDataResponse = {
  hash: string;
  chargetotal: string;
  currency: number;
  oid: string;
  responseFailURL: string;
  responseSuccessURL: string;
  txndatetime: string;
  txntype: string;
  checkoutoption: string;
  hash_algorithm: string;
  timezone: string;
  storename: string;
  transactionNotificationURL: string;
};

export type PayForRentResponse = {
  paymentId: string;
  paymentStatus: PaymentStatus;
  paymentData?: GeneratePaymentDataResponse;
  url?: string;
  rentId?: string;
  boxId?: string;
};

export type SignedDownloadUrlRes = {
  url: string;
  expiresAt: string;
};

export type EndRentPhotoDownloadUrlRes = SignedDownloadUrlRes;

export type RentFileDownloadUrlRes = SignedDownloadUrlRes;
