import { pieLegendPercent } from './chart-percent';

describe('pieLegendPercent', () => {
  it('rounds to a whole percent and keeps two decimal places in the label', () => {
    expect(pieLegendPercent(1, 3)).toBe('33.00');
    expect(pieLegendPercent(1, 2)).toBe('50.00');
  });

  it('returns zero when the total is empty', () => {
    expect(pieLegendPercent(5, 0)).toBe(0);
  });
});
