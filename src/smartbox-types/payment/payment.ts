import { RentPaymentType } from "../rent";
import { PaymentStatus, PaymentType } from "./payment-entity";

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