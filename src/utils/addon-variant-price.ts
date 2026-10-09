import {
  SingleAddonVariantForUser,
  SingleAddonVariantForUserWithCorrectedPrice,
} from 'smartbox-types';

export const correctAddonVariantPrice = (
  variant: SingleAddonVariantForUser,
  tax: string,
): SingleAddonVariantForUserWithCorrectedPrice => {
  const parsedTax = parseInt(tax);

  if (isNaN(parsedTax))
    return { ...variant, price: 0, netPrice: 0, grossPrice: 0 };

  if (variant.price) {
    return {
      ...variant,
      price: variant.price * (1 + Number(tax) / 100),
      netPrice: variant.price,
      grossPrice: variant.price * (1 + Number(tax) / 100),
    };
  }

  return { ...variant, price: 0, netPrice: 0, grossPrice: 0 };
};
