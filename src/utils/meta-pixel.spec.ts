import { metaEventForPaymentType } from './meta-pixel';

describe('metaEventForPaymentType', () => {
  it('keeps Purchase for a new rent and splits the other payments', () => {
    expect(metaEventForPaymentType('new_rent')).toEqual({
      name: 'Purchase',
      custom: false,
    });
    expect(metaEventForPaymentType('extension')).toEqual({
      name: 'RentExtension',
      custom: true,
    });
    expect(metaEventForPaymentType('period_payment')).toEqual({
      name: 'RentPeriodPayment',
      custom: true,
    });
    expect(metaEventForPaymentType(undefined)).toBeNull();
  });
});
