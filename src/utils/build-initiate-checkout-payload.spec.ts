import { PriceDisplayForClients } from 'smartbox-types';
import { OrderAddon } from 'src/reducers/order-reducer';
import { buildInitiateCheckoutPayload } from 'src/utils/build-initiate-checkout-payload';

const addon = (overrides: Partial<OrderAddon> = {}): OrderAddon => ({
  name: 'Insurance',
  slug: 'insurance',
  required: false,
  selectedVariant: 'v1',
  selectedVariantName: 'Standard',
  acceptancesStatus: {},
  acceptances: [],
  userFileAllowed: false,
  noPricing: false,
  userFileRequirement: null,
  price: [
    { value: 10, netPrice: 8, grossPrice: 10, isGross: true },
  ],
  file: null,
  tax: '23',
  ...overrides,
});

const order = {
  calculatedPrice: [
    {
      value: 100,
      isGross: true,
      netPrice: 81.3,
      grossPrice: 100,
      display: PriceDisplayForClients.gross,
    },
  ],
  orderAddons: {
    insurance: addon(),
    skipped: addon({ slug: '', price: null }),
  },
};

describe('buildInitiateCheckoutPayload', () => {
  it('returns null without a box group or a calculated price', () => {
    expect(
      buildInitiateCheckoutPayload(order, {
        boxGroupId: '',
        paymentType: 'new_rent',
      }),
    ).toBeNull();
    expect(
      buildInitiateCheckoutPayload(
        { ...order, calculatedPrice: [] },
        { boxGroupId: 'bg', paymentType: 'new_rent' },
      ),
    ).toBeNull();
  });

  it('sums rent and priced addons into the checkout payload', () => {
    const payload = buildInitiateCheckoutPayload(order, {
      boxGroupId: 'bg-1',
      boxGroupName: 'M',
      boxGroupArea: '4',
      stockName: 'Centrum',
      paymentType: 'extension',
    });

    expect(payload).toMatchObject({
      value: 110,
      value_gross: 110,
      value_net: 89.3,
      currency: 'PLN',
      content_name: 'M — 4m² — Centrum',
      content_ids: ['bg-1', 'insurance'],
      num_items: 2,
      payment_type: 'extension',
    });
    expect(payload?.contents).toEqual([
      { id: 'bg-1', quantity: 1, item_price: 100 },
      { id: 'insurance', quantity: 1, item_price: 10 },
    ]);
  });
});
