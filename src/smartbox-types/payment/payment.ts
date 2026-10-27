import { CalculatedPriceRes } from "src/smartbox-types/box-group/pricing";
import { PaymentDocument, PaymentStatus, PaymentType } from "src/smartbox-types/payment/payment-entity";
import { RentPaymentType } from "src/smartbox-types/rent";

export interface CompanyData {
  companyName: string;
  companyStreet: string;
  companyCity: string;
  companyPostCode: string;
  companyCountry: string;
  nip: string;
}

export type PaymentTransaction = {
  approvedAmount: {
    total: number;
  };
  transactionResult: string;
  approvalCode: string;
  paymentMethodDetails: {
    paymentMethodType: string;
    paymentMethodBrand: string;
  }
};

export type PaymentResponse = {
  transactions: PaymentTransaction[];
};

export type PaymentErrorResponse = {
  response: {
    data: {
      error: {
        code: string;
        message: string;
        details: {
          field: string;
          message: string;
        }[];
      };
    };
  };
};

export type PaymentNotificationBody = {
  approval_code: string;
  txndate_processed: string;
  txndatetime: string;
  timezone: string;
  response_hash?: string;
  notification_hash?: string;
  oid: string;
  status: string;
  chargetotal: string;
  currency: string;
  paymentMethod: string;
}

export type PaymentDetails = {
  status: PaymentStatus;
  type: PaymentType;
  paymentType: RentPaymentType;
  /** Rent price breakdown (same shape as calculate-price API). */
  price?: CalculatedPriceRes['price'];
  addons: {
    slug: string;
    grossPrice: number | string;
    netPrice?: number | string;
    name: string
  }[];
  groupId: string;
  /** Legacy display value for the first rent period (unchanged semantics). */
  rentGrossPrice: number;
  name: string;
  area: string | number;
  stockName: string;
  stockAddress: string;
  value: number
}

export type PaymentAdminListItem = {
  id: string;
  date: Date;
  updated: Date;
  mailToSendInvoice: string;
  status: PaymentStatus;
  type: PaymentType;
  value: number;
  method: string;
  document: PaymentDocument;
  invoiceId: string;
  invoiceNumber: string;
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
  | 'date'
  | 'updated'
  | 'mailToSendInvoice'
  | 'status'
  | 'type'
  | 'value'
  | 'method'
  | 'document'
  | 'invoiceId'
  | 'invoiceNumber'
  | 'orderId'
  | 'rentId'
  | 'periodId'
  | 'stockName'
  | 'boxGroupId'
  | 'boxGroupName'
  | 'boxNumber'
  | 'ownerEmail'
>;