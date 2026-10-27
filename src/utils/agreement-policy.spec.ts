import { RentAgreementType, StockAgreementType } from 'smartbox-types';
import {
  allowsFixedTerm,
  allowsOpenEnded,
  resolveCheckoutAgreementType,
} from 'src/utils/agreement-policy';

describe('agreement policy', () => {
  it('allows fixed term unless the stock is open-ended only', () => {
    expect(allowsFixedTerm(undefined)).toBe(true);
    expect(allowsFixedTerm(StockAgreementType.FixedTerm)).toBe(true);
    expect(allowsFixedTerm(StockAgreementType.Both)).toBe(true);
    expect(allowsFixedTerm(StockAgreementType.OpenEnded)).toBe(false);
  });

  it('allows open-ended only when the stock includes it', () => {
    expect(allowsOpenEnded(StockAgreementType.OpenEnded)).toBe(true);
    expect(allowsOpenEnded(StockAgreementType.Both)).toBe(true);
    expect(allowsOpenEnded(StockAgreementType.FixedTerm)).toBe(false);
    expect(allowsOpenEnded(undefined)).toBe(false);
  });

  it('forces the checkout type from the stock, and keeps a choice when both are allowed', () => {
    expect(resolveCheckoutAgreementType(StockAgreementType.OpenEnded)).toBe(
      RentAgreementType.OpenEnded,
    );
    expect(
      resolveCheckoutAgreementType(
        StockAgreementType.FixedTerm,
        RentAgreementType.OpenEnded,
      ),
    ).toBe(RentAgreementType.FixedTerm);
    expect(resolveCheckoutAgreementType(undefined)).toBe(
      RentAgreementType.FixedTerm,
    );
    expect(
      resolveCheckoutAgreementType(
        StockAgreementType.Both,
        RentAgreementType.OpenEnded,
      ),
    ).toBe(RentAgreementType.OpenEnded);
    expect(resolveCheckoutAgreementType(StockAgreementType.Both, null)).toBe(
      RentAgreementType.FixedTerm,
    );
  });
});
