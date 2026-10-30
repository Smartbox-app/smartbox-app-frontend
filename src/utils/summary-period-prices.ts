type PeriodPrice = {
  netPrice: number;
  grossPrice: number;
};

export const sumAddonPricesPerPeriod = (
  addons: { price: PeriodPrice[] | null }[],
) => {
  const everyAddonPricePerPeriod: { net: number; gross: number }[] = [];

  for (const addon of addons) {
    const pricePerPeriod = (addon.price || []).map((price) => ({
      net: price.netPrice,
      gross: price.grossPrice,
    }));

    for (let i = 0; i < pricePerPeriod.length; i++) {
      if (!everyAddonPricePerPeriod[i]) {
        everyAddonPricePerPeriod[i] = { net: 0, gross: 0 };
      }
      everyAddonPricePerPeriod[i].net =
        (everyAddonPricePerPeriod[i].net || 0) + pricePerPeriod[i].net;
      everyAddonPricePerPeriod[i].gross =
        (everyAddonPricePerPeriod[i].gross || 0) + pricePerPeriod[i].gross;
    }
  }

  return everyAddonPricePerPeriod;
};
