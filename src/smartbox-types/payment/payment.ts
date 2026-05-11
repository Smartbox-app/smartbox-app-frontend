import { RentPaymentType } from "../rent";
import { PaymentDocument, PaymentStatus, PaymentType } from "./payment-entity";

export interface CompanyData {
  companyName: string;
  companyStreet: string;
  companyCity: string;
  companyPostCode: string;
  companyCountry: string;
  nip: string;
}

export type PaymentDetails = {
  status: PaymentStatus;
  type: PaymentType;
  paymentType: RentPaymentType;
  addons: {
    slug: string;
    grossPrice: number | string;
    name: string
  }[];
  rentGrossPrice: number;
  name: string;
  area: string | number;
  stockName: string;
  stockAddress: string;
  groupId: string;
}

export type PaymentAdminListItem = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  status: PaymentStatus;
  type: PaymentType;
  value: number;
  method: string;
  document: PaymentDocument;
  invoiceId: string;
  orderId: string;
  rentId: string | null;
  periodId: string | null;
  stockName: string | null;
  boxGroupId: string | null;
  boxGroupName: string | null;
  boxNumber: string | null;
  ownerEmail: string | null;
  tenantId: string | null;
  tenant: string | null;
};

export type PaymentClientListItem = Pick<
  PaymentAdminListItem,
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'status'
  | 'type'
  | 'value'
  | 'method'
  | 'document'
  | 'invoiceId'
  | 'orderId'
  | 'rentId'
  | 'periodId'
  | 'stockName'
  | 'boxGroupId'
  | 'boxGroupName'
  | 'boxNumber'
  | 'ownerEmail'
>;