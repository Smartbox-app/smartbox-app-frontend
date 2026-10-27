import { OrderState } from 'src/reducers/order-reducer';
import { sumEcommerceTrackingValues } from 'src/utils/ecommerce-tracking-values';
import { MetaInitiateCheckoutPayload } from 'src/utils/meta-pixel';

type InitiateCheckoutContext = {
  boxGroupId: string;
  boxGroupName?: string;
  boxGroupArea?: string;
  stockName?: string;
  /** new_rent for a new order, extension when continuing an existing rent. */
  paymentType: 'new_rent' | 'extension';
};

export const buildInitiateCheckoutPayload = (
  order: Pick<OrderState, 'calculatedPrice' | 'orderAddons'>,
  context: InitiateCheckoutContext,
): MetaInitiateCheckoutPayload | null => {
  if (!context.boxGroupId || !order.calculatedPrice?.length) return null;

  const rentPeriod = order.calculatedPrice[0];
  const pricedAddons = Object.values(order.orderAddons).flatMap((addon) => {
    const period = addon.price?.[0];
    if (!period || !addon.slug) return [];
    return [
      {
        id: addon.slug,
        name: addon.name,
        grossPrice: period.grossPrice,
        netPrice: period.netPrice,
      },
    ];
  });

  const { valueGross, valueNet } = sumEcommerceTrackingValues(
    rentPeriod
      ? { grossPrice: rentPeriod.grossPrice, netPrice: rentPeriod.netPrice }
      : undefined,
    pricedAddons,
  );

  const area = context.boxGroupArea ? `${context.boxGroupArea}m²` : '';
  const contentName = [context.boxGroupName, area, context.stockName]
    .filter(Boolean)
    .join(' — ');
  const rentPrice = rentPeriod?.grossPrice ?? 0;
  const items = [
    {
      id: context.boxGroupId,
      name: contentName || undefined,
      price: rentPrice,
    },
    ...pricedAddons.map((addon) => ({
      id: addon.id,
      name: addon.name,
      price: Number(addon.grossPrice) || 0,
    })),
  ];

  return {
    value: valueGross,
    value_gross: valueGross,
    value_net: valueNet,
    currency: 'PLN',
    content_name: contentName || undefined,
    content_ids: items.map((item) => item.id),
    content_type: 'product',
    contents: items.map((item) => ({
      id: item.id,
      quantity: 1,
      item_price: item.price,
    })),
    num_items: items.length,
    payment_type: context.paymentType,
    items,
  };
};
