export type TrackingPricePeriod = {
  grossPrice: number;
  netPrice: number;
};

export type TrackingAddonPrice = {
  grossPrice?: number | string | null;
  netPrice?: number | string | null;
};

export const sumEcommerceTrackingValues = (
  rentPeriod: TrackingPricePeriod | undefined,
  addons: TrackingAddonPrice[],
  rentGrossFallback = 0,
) => {
  const rentGross = rentPeriod?.grossPrice ?? rentGrossFallback;
  const rentNet = rentPeriod?.netPrice ?? 0;

  const addonsGross = addons.reduce(
    (sum, addon) => sum + (Number(addon.grossPrice) || 0),
    0,
  );
  const addonsNet = addons.reduce(
    (sum, addon) => sum + (Number(addon.netPrice) || 0),
    0,
  );

  const valueGross = rentGross + addonsGross;
  const valueNet = rentNet + addonsNet;

  return { valueGross, valueNet };
};
