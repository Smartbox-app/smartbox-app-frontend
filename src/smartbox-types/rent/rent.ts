import { AcceptanceStatuses, SingleAcceptance } from 'src/smartbox-types/addon';
import { BoxStatus } from 'src/smartbox-types/box/box-entity';
import { CompanyData, PaymentDocument, PaymentStatus } from 'src/smartbox-types/payment';
import { PeriodEntity } from 'src/smartbox-types/period';
import { RentAgreementType, RentDescription, RentPaymentType, RentStatus, OpenEndedNextPeriodPreview } from 'src/smartbox-types/rent/rent-entity';

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
  finishAt?: string;
  agreementType?: RentAgreementType;
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
  finishAt?: string | null;
  agreementType?: RentAgreementType;

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

export class BoxListItem {
  rentId: string;
  number: string;
  size: number;
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
  finishAt: Date | null;
  agreementType?: RentAgreementType;
  decisionFinishAt: Date;
  owner: RentDetailsUser;
  periods?: PeriodEntity[];
  description?: RentDescription[];
  paymentType?: RentPaymentType;
  /** True when the current user was granted access via rent authorization (not the rent owner). */
  isAuthorized: boolean;
  endRentPhoto?: string | null;
  /** Set for keypad boxes (TTLock, Keylessbox). Null until a code is issued. */
  passcode?: string | null;
}

export class RentDetailsUser {
  email: string;
  firstName: string;
  lastName: string;
  rentCount: number;
  phone: string;
}

export class MyRentList {
  id: string;
  status: RentStatus;
  createdAt: Date;
  startAt: Date;
  finishAt: Date | null;
  agreementType?: RentAgreementType;
  decisionFinishAt: Date;
  size: number;
  stockName: string;
  stockId: string;
  boxId: string;
  boxNumber: string;
  boxAdditionalInfo: string;
  number: string;
}

export type RentAuthorizedUserSummary = {
  authorizationId: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
};

/** Staff table list item for rent gate authorizations. */
export type RentAuthorizationListItem = {
  id: string;
  rentId: string;
  email: string;
  phone: string;
  boxNumber: string;
  startAt: Date | string;
  finishAt: Date | string | null;
};

export type MyRentDetails = {
  id: string;
  status: RentStatus;
  createdAt: Date;
  startAt: Date;
  finishAt: Date | null;
  agreementType?: RentAgreementType;
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
  /** Only available for the rent owner (not authorized guests). */
  note?: string | null;
  description?: RentDescription[];
  periods?: PeriodEntity[];
  pendingPayments?: boolean;
  paymentType?: RentPaymentType;
  passcode: string | null;
  /** True when the current user was granted access via rent authorization (not the rent owner). */
  isAuthorized: boolean;
  nextPeriodPreview?: OpenEndedNextPeriodPreview | null;
};

/** Authorized-user rent list (`GET /rent/me-authorized`): same shape as {@link MyRentList}, no billing fields. */
export type MyAuthorizedRentListItem = Pick<
  MyRentList,
  | 'id'
  | 'status'
  | 'createdAt'
  | 'startAt'
  | 'finishAt'
  | 'size'
  | 'stockName'
  | 'stockId'
  | 'boxId'
  | 'boxNumber'
  | 'boxAdditionalInfo'
  | 'number'
> & { isAuthorized: true };

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
  finishAt?: string;
  agreementType?: RentAgreementType;
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
