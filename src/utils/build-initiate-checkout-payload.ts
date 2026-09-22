import { MetaInitiateCheckoutPayload } from 'src/utils/meta-pixel';
import { OrderState } from 'src/reducers/order-reducer';
import { sumEcommerceTrackingValues } from 'src/utils/ecommerce-tracking-values';

type InitiateCheckoutContext = {
  boxGroupId: string;
  boxGroupName?: string;
  boxGroupArea?: string;
  stockName?: string;
};

export const buildInitiateCheckoutPayload = (
  order: Pick<OrderState, 'calculatedPrice' | 'orderAddons'>,
  context: InitiateCheckoutContext,
): MetaInitiateCheckoutPayload | null => {
  if (!context.boxGroupId || !order.calculatedPrice?.length) return null;

  const rentPeriod = order.calculatedPrice[0];
  const addonPrices = Object.values(order.orderAddons).flatMap((addon) =>
    addon.price?.[0]
      ? [{ grossPrice: addon.price[0].grossPrice, netPrice: addon.price[0].netPrice }]
      : [],
  );

  const { valueGross, valueNet } = sumEcommerceTrackingValues(
    rentPeriod
      ? { grossPrice: rentPeriod.grossPrice, netPrice: rentPeriod.netPrice }
      : undefined,
    addonPrices,
  );

  const area = context.boxGroupArea ? `${context.boxGroupArea}m²` : '';
  const contentName = [context.boxGroupName, area, context.stockName]
    .filter(Boolean)
    .join(' — ');

  return {
    value: valueGross,
    value_gross: valueGross,
    value_net: valueNet,
    currency: 'PLN',
    content_name: contentName || undefined,
    content_ids: [context.boxGroupId],
    content_type: 'product',
  };
};
