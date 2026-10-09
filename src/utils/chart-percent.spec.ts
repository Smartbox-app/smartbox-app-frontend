import { pieLegendPercent } from './chart-percent';

describe('pieLegendPercent', () => {
  it('keeps two decimal places, rounding half up', () => {
    expect(pieLegendPercent(1, 3)).toBe('33.33');
    expect(pieLegendPercent(2, 3)).toBe('66.67');
    expect(pieLegendPercent(1, 2)).toBe('50.00');
  });

  it('returns zero when the total is empty', () => {
    expect(pieLegendPercent(5, 0)).toBe('0.00');
  });
});
