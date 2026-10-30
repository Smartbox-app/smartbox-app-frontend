import { sumEcommerceTrackingValues } from 'src/utils/ecommerce-tracking-values';

describe('sumEcommerceTrackingValues', () => {
  it('adds rent and addon gross and net prices', () => {
    expect(
      sumEcommerceTrackingValues(
        { grossPrice: 100, netPrice: 80 },
        [
          { grossPrice: 10, netPrice: 8 },
          { grossPrice: '5', netPrice: '4' },
        ],
      ),
    ).toEqual({ valueGross: 115, valueNet: 92 });
  });

  it('falls back when the rent period or addon prices are missing', () => {
    expect(
      sumEcommerceTrackingValues(undefined, [{ grossPrice: null, netPrice: '' }], 40),
    ).toEqual({ valueGross: 40, valueNet: 0 });
  });

  it('treats non-numeric addon prices as zero', () => {
    expect(
      sumEcommerceTrackingValues(
        { grossPrice: 10, netPrice: 8 },
        [{ grossPrice: 'abc', netPrice: undefined }],
      ),
    ).toEqual({ valueGross: 10, valueNet: 8 });
  });
});
