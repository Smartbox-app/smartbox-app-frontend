import {
  RentAgreementType,
  StockAgreementType,
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
