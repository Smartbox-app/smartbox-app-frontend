import { OrderAddon } from 'src/reducers/order-reducer';
import {
  addonPrice,
  getAddonsWithCorrectPrice,
  getCorrectPrice,
  getSimplifiedAddons,
} from 'src/utils/agreement-checkout-price';

const addon = (overrides: Partial<OrderAddon> = {}): OrderAddon => ({
  name: 'Lock',
  slug: 'lock',
  required: false,
  selectedVariant: 'v1',
  selectedVariantName: 'Standard',
  acceptancesStatus: { a1: { accepted: true } },
  acceptances: [{ id: 'a1', text: 'I agree', required: true }],
  userFileAllowed: false,
  noPricing: false,
  userFileRequirement: null,
  price: [
    { value: 100, netPrice: 100, grossPrice: 123, isGross: false },
    { value: 20, netPrice: 20, grossPrice: 24.6, isGross: false },
  ],
  file: null,
  tax: '23',
  ...overrides,
});

describe('agreement checkout price', () => {
  it('sums gross period values without applying tax', () => {
    expect(
      getCorrectPrice(
        [{ value: 100 }, { value: 20 }],
        true,
        'not-a-tax',
      ),
    ).toBe(120);
  });

  it('applies tax to each net period and then sums', () => {
    expect(getCorrectPrice([{ value: 100 }, { value: 20 }], false, '23')).toBe(
      147.6,
    );
    expect(getCorrectPrice([{ value: 100 }], false, 'zw')).toBe(100);
  });

  it('keeps a gross addon total and taxes a net addon total', () => {
    expect(
      addonPrice(
        [{ value: 100, netPrice: 100, grossPrice: 100, isGross: true }],
        100,
        0.23,
      ),
    ).toBe(100);
    expect(addonPrice(addon().price, 120, 0.23)).toBe(147.6);
    expect(addonPrice(null, 0, 0.23)).toBeNull();
  });

  it('builds addon payloads and a simplified list from the same totals', () => {
    const orderAddons = {
      lock: addon(),
      padlock: addon({
        slug: 'padlock',
        selectedVariantName: 'Large',
        tax: 'zw',
        price: [
          { value: 50, netPrice: 50, grossPrice: 50, isGross: true },
        ],
      }),
    };

    expect(getAddonsWithCorrectPrice(orderAddons).lock).toMatchObject({
      price: 147.6,
      selectedVariant: 'v1',
      selectedVariantName: 'Standard',
    });
    expect(getSimplifiedAddons(orderAddons)).toEqual([
      { slug: 'lock', variant: 'Standard', price: 147.6 },
      { slug: 'padlock', variant: 'Large', price: 50 },
    ]);
  });
});
