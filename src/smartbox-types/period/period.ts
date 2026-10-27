import { PeriodDescription } from "src/smartbox-types/rent";

/**
 * Raw row from the periods-for-rent table query (`tableBuilder` / getRawMany).
 */
export type PeriodListQueryRow = {
  id: string;
  createdAt: Date;
  startAt: Date;
  finishAt: Date;
  rentFinishAt: Date | null;
  paymentTo: Date;
  value: number | string;
  paid: boolean;
  rentId: string | null;
  invoiceId: string;
  invoiceNumber: string;
  agreementDocumentId?: string | null;
};

/**
 * One period in the list API for a given rent.
 */
export type PeriodListItem = {
  id: string;
  createdAt: Date;
  startAt: Date;
  finishAt: Date;
  rentFinishAt: Date | null;
  paymentTo: Date;
  value: number;
  paid: boolean;
  rentId: string | null;
  invoiceId: string;
  invoiceNumber: string;
  agreementDocumentId?: string | null;
};

export type PeriodEntity = {
    startAt: Date;
    finishAt: Date;
    rentFinishAt: Date | null;
    createdAt: Date;
    paymentTo: Date;
    value: number;
    paid: boolean;
    invoiceId: string;
    invoiceNumber: string;
    description: PeriodDescription;
    agreementDocumentId?: string | null;
}

export type PeriodConfiguration = {
    startAt: Date;
    finishAt: Date;
    rentFinishAt: Date | null;
    paymentTo: Date;
    value: number;
    description: PeriodDescription;
}
