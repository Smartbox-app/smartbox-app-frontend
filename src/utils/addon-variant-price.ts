import {
  SingleAddonVariantForUser,
  SingleAddonVariantForUserWithCorrectedPrice,
} from 'smartbox-types';

export const correctAddonVariantPrice = (
  variant: SingleAddonVariantForUser,
  tax: string,
): SingleAddonVariantForUserWithCorrectedPrice => {
  const parsedTax = tax === 'zw' || tax === 'np' ? 0 : parseInt(tax, 10);

  if (Number.isNaN(parsedTax)) throw new Error('Invalid addon tax');

  if (variant.price) {
    const gross = variant.price * (1 + parsedTax / 100);
    return {
      ...variant,
      price: gross,
      netPrice: variant.price,
      grossPrice: gross,
    };
  }

  return { ...variant, price: 0, netPrice: 0, grossPrice: 0 };
};
