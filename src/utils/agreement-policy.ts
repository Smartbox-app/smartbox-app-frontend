import {
  RentAgreementType,
  RentPaymentType,
  StockAgreementType,
  StockPaymentType,
} from 'smartbox-types';

export const allowsFixedTerm = (allowed?: StockAgreementType) =>
  !allowed ||
  allowed === StockAgreementType.FixedTerm ||
  allowed === StockAgreementType.Both;

export const allowsOpenEnded = (allowed?: StockAgreementType) =>
  allowed === StockAgreementType.OpenEnded ||
  allowed === StockAgreementType.Both;

export const resolveCheckoutAgreementType = (
  allowed: StockAgreementType | undefined,
  selected?: RentAgreementType | null,
): RentAgreementType => {
  if (allowed === StockAgreementType.OpenEnded) {
    return RentAgreementType.OpenEnded;
  }
  if (allowed === StockAgreementType.FixedTerm || !allowed) {
    return RentAgreementType.FixedTerm;
  }
  return selected || RentAgreementType.FixedTerm;
};

export const resolveCheckoutPaymentType = (
  config: StockPaymentType | undefined,
  selected: RentPaymentType | null,
  openEnded: boolean,
): RentPaymentType => {
  if (openEnded || config === StockPaymentType.Installments) {
    return RentPaymentType.Installments;
  }
  if (config === StockPaymentType.Both) {
    return selected || RentPaymentType.InAdvance;
  }
  return RentPaymentType.InAdvance;
};
