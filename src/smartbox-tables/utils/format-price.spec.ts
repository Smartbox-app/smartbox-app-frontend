import { formatPrice } from './format-price';

describe('table formatPrice', () => {
  it('groups thousands, uses a decimal comma, and appends zł', () => {
    expect(formatPrice(1234.5)).toBe('1 234,50 zł');
    expect(formatPrice(1234.5, true)).toBe('1&nbsp;234,50 zł');
  });
});
