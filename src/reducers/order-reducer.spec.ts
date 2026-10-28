import { AddonRes, PriceDisplayForClients } from 'smartbox-types';
import orderReducer from 'src/reducers/order-reducer';

const addon = (overrides: Partial<AddonRes> = {}): AddonRes =>
  ({
    id: 'optional',
    name: 'Padlock',
    slug: 'padlock',
    tax: '23',
    required: false,
    acceptances: [{ id: 'acc-1', text: 'I agree', required: true }],
    userFileAllowed: false,
    noPricing: false,
    userFileRequirement: null,
    description: '',
    additionalDescription: '',
    fileText: '',
    userFileText: '',
    stockId: 'stock',
    order: 0,
    active: true,
    newRentOnly: false,
    display: PriceDisplayForClients.gross,
    isGross: true,
    pricing: [],
    ...overrides,
  }) as AddonRes;

describe('order reducer', () => {
  it('builds addon state and sorts required addons first', () => {
    const next = orderReducer(undefined, {
      type: 'FETCH_ADDONS_SUCCESS',
      payload: [
        addon(),
        addon({ id: 'required', name: 'Insurance', required: true }),
      ],
    });

    expect(next.addons.map((item) => item.id)).toEqual(['required', 'optional']);
    expect(next.orderAddons.required).toMatchObject({
      selectedVariant: null,
      price: null,
      file: null,
      acceptancesStatus: { 'acc-1': { accepted: false } },
    });
  });

  it('stores a variant price only when that variant is still selected', () => {
    const withAddons = orderReducer(undefined, {
      type: 'FETCH_ADDONS_SUCCESS',
      payload: [addon({ id: 'lock' })],
    });
    const selected = orderReducer(withAddons, {
      type: 'SELECT_ADDON',
      payload: { addonId: 'lock', variantId: 'v1', variantName: 'Standard' },
    });
    const price = [{ value: 10, netPrice: 8, grossPrice: 10, isGross: true }];

    const stale = orderReducer(selected, {
      type: 'CALCULATE_VARIANT_PRICE_SUCCESS',
      payload: { addonId: 'lock', variantId: 'other', price, details: [] },
    });
    expect(stale).toBe(selected);

    const priced = orderReducer(selected, {
      type: 'CALCULATE_VARIANT_PRICE_SUCCESS',
      payload: { addonId: 'lock', variantId: 'v1', price, details: [] },
    });
    expect(priced.orderAddons.lock.price).toEqual(price);
    expect(
      orderReducer(priced, {
        type: 'CALCULATE_VARIANT_PRICE_SUCCESS',
        payload: { addonId: 'lock', variantId: 'v1', price, details: [] },
      }),
    ).toBe(priced);
    expect(
      orderReducer(priced, {
        type: 'CLEAR_ADDON_PRICE',
        payload: { addonId: 'lock' },
      }).orderAddons.lock.price,
    ).toBeNull();
    const cleared = orderReducer(priced, {
      type: 'CLEAR_ADDON_PRICE',
      payload: { addonId: 'lock' },
    });
    expect(
      orderReducer(cleared, {
        type: 'CLEAR_ADDON_PRICE',
        payload: { addonId: 'lock' },
      }),
    ).toBe(cleared);
  });

  it('updates one acceptance and ignores an unknown addon', () => {
    const withAddons = orderReducer(undefined, {
      type: 'FETCH_ADDONS_SUCCESS',
      payload: [addon({ id: 'lock' })],
    });
    const accepted = orderReducer(withAddons, {
      type: 'SET_ADDON_ACCEPTANCE',
      payload: { addonId: 'lock', acceptanceId: 'acc-1', checked: true },
    });

    expect(accepted.orderAddons.lock.acceptancesStatus['acc-1'].accepted).toBe(
      true,
    );
    expect(
      orderReducer(accepted, {
        type: 'SELECT_ADDON',
        payload: { addonId: 'missing', variantId: 'v', variantName: 'V' },
      }),
    ).toBe(accepted);
  });

  it('toggles resignation and clears the order back to the initial state', () => {
    const initial = orderReducer(undefined, { type: 'NOPE' } as never);
    const marked = orderReducer(initial, {
      type: 'FORM_RESIGNATION_MARKED_SUCCESS',
    });
    expect(marked.isResignationMarked).toBe(true);
    expect(
      orderReducer(marked, { type: 'FORM_RESIGNATION_MARKED_SUCCESS' })
        .isResignationMarked,
    ).toBe(false);

    const dirty = orderReducer(marked, {
      type: 'SET_DISCOUNT_CODE',
      payload: 'SPRING',
    });
    expect(orderReducer(dirty, { type: 'CLEAR_ORDER' })).toBe(initial);
  });
});
