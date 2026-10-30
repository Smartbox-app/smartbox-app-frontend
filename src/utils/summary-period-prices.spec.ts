import { sumAddonPricesPerPeriod } from 'src/utils/summary-period-prices';

describe('sumAddonPricesPerPeriod', () => {
  it('sums net and gross prices that share a period index', () => {
    expect(
      sumAddonPricesPerPeriod([
        {
          price: [
            { netPrice: 10, grossPrice: 12 },
            { netPrice: 20, grossPrice: 24 },
          ],
        },
        {
          price: [{ netPrice: 5, grossPrice: 6 }],
        },
        { price: null },
      ]),
    ).toEqual([
      { net: 15, gross: 18 },
      { net: 20, gross: 24 },
    ]);
  });

  it('returns an empty list when there are no addons', () => {
    expect(sumAddonPricesPerPeriod([])).toEqual([]);
  });
});
