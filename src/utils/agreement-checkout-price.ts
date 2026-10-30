import { OrderAddons } from 'smartbox-types';
import { OrderAddon } from 'src/reducers/order-reducer';
import {
  getCorrectPriceWithTax,
  getCorrectPriceWithTaxForArray,
  getCorrectTaxPercentAmount,
} from 'src/utils/tax';

export const addonPrice = (
  price: OrderAddon['price'],
  totalAddonPrice: number,
  taxValue: number,
) => {
  if (!price) return null;
  if (price[0].isGross) return totalAddonPrice;
  return getCorrectPriceWithTaxForArray(price, taxValue);
};

export const getCorrectPrice = (
  price: { value: number }[],
  isGross: boolean,
  tax: string,
) => {
  if (isGross) return price.reduce((acc, curr) => acc + curr.value, 0);
  const taxValue = getCorrectTaxPercentAmount(tax);

  const priceWithTax = price.map((p) =>
    getCorrectPriceWithTax(p.value, taxValue),
  );

  return priceWithTax.reduce((acc, curr) => acc + curr, 0);
};

export const getAddonsWithCorrectPrice = (orderAddons: {
  [addonId: string]: OrderAddon;
}): OrderAddons => {
  const parsedAddons: OrderAddons = {};

  Object.keys(orderAddons).forEach((addonId) => {
    const addon = orderAddons[addonId];
    const taxValue = getCorrectTaxPercentAmount(addon.tax);
    const totalAddonPrice = (addon.price || []).reduce(
      (acc, curr) => acc + curr.value,
      0,
    );

    parsedAddons[addonId] = {
      acceptancesStatus: addon.acceptancesStatus,
      acceptances: addon.acceptances,
      price: addonPrice(addon.price, totalAddonPrice, taxValue),
      selectedVariant: addon.selectedVariant,
      selectedVariantName: addon.selectedVariantName,
    };
  });

  return parsedAddons;
};

export const getSimplifiedAddons = (orderAddons: {
  [addonId: string]: OrderAddon;
}) => {
  const simplified: {
    slug: string;
    variant: string | null;
    price: number | null;
  }[] = [];

  Object.keys(orderAddons).forEach((addonId) => {
    const addon = orderAddons[addonId];
    const taxValue = getCorrectTaxPercentAmount(addon.tax);
    const totalAddonPrice = (addon.price || []).reduce(
      (acc, curr) => acc + curr.value,
      0,
    );
    simplified.push({
      slug: addon.slug,
      variant: addon.selectedVariantName,
      price: addonPrice(addon.price, totalAddonPrice, taxValue),
    });
  });

  return simplified;
};
