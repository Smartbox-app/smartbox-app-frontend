import { RentPaymentType } from "../rent";
import { PaymentDocument, PaymentStatus, PaymentType } from "./payment-entity";
import { PriceDisplayForClients } from "../stock/price-display-for-clients";

export interface CompanyData {
  companyName: string;
  companyStreet: string;
  companyCity: string;
  companyPostCode: string;
  companyCountry: string;
  nip: string;
}

export type CalculatedPricePeriod = {
  isGross: boolean;
  value: number;
  grossPrice: number;
  netPrice: number;
  display?: PriceDisplayForClients;
};

export type PaymentDetails = {
  status: PaymentStatus;
  type: PaymentType;
  paymentType: RentPaymentType;
  /** Rent price breakdown (same shape as calculate-price API). Optional — use for net/gross tracking. */
  price?: CalculatedPricePeriod[];
  addons: {
    slug: string;
    grossPrice: number | string;
    netPrice?: number | string;
    name: string
  }[];
  /** Legacy display value for the first rent period (unchanged semantics). */
  rentGrossPrice: number;
  name: string;
  area: string | number;
  stockName: string;
  stockAddress: string;
  groupId: string;
  /** Email provided during the order (invoice recipient). Used for GTM enhanced conversions. */
  mailToSendInvoice?: string;
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