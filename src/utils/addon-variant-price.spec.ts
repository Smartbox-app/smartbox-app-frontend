import { AddonVariantPriceType } from 'smartbox-types';
import { correctAddonVariantPrice } from './addon-variant-price';

const variant = {
  id: 'v1',
  name: 'Standard',
  default: true,
  pricing: [],
  priceType: AddonVariantPriceType.Fixed,
  price: 100,
};

describe('correctAddonVariantPrice', () => {
  it('stores the net price and a gross price that includes tax', () => {
    expect(correctAddonVariantPrice(variant, '23')).toMatchObject({
      price: 123,
      netPrice: 100,
      grossPrice: 123,
    });
  });

  it('keeps the net price when the rate is exempt', () => {
    expect(correctAddonVariantPrice(variant, 'zw')).toMatchObject({
      price: 100,
      netPrice: 100,
      grossPrice: 100,
    });
  });

  it('throws when the tax cannot be parsed', () => {
    expect(() => correctAddonVariantPrice(variant, 'abc')).toThrow(
      'Invalid addon tax',
    );
  });

  it('zeroes the prices when the variant has no price', () => {
    expect(correctAddonVariantPrice({ ...variant, price: 0 }, '23')).toMatchObject({
      price: 0,
      netPrice: 0,
      grossPrice: 0,
    });
    expect(correctAddonVariantPrice({ ...variant, price: null }, '23')).toMatchObject({
      price: 0,
      netPrice: 0,
      grossPrice: 0,
    });
  });
});
