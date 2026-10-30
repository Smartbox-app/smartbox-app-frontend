import {
  getCorrectPriceWithTax,
  getCorrectPriceWithTaxForArray,
  getCorrectTaxPercentAmount,
} from 'src/utils/tax';

describe('tax', () => {
  describe('getCorrectTaxPercentAmount', () => {
    it('treats exempt and non-taxable rates as zero', () => {
      expect(getCorrectTaxPercentAmount('zw')).toBe(0);
      expect(getCorrectTaxPercentAmount('np')).toBe(0);
    });

    it('parses a percent string into a fraction', () => {
      expect(getCorrectTaxPercentAmount('23')).toBe(0.23);
      expect(getCorrectTaxPercentAmount('8')).toBe(0.08);
    });

    it('throws when the rate is not numeric', () => {
      expect(() => getCorrectTaxPercentAmount('abc')).toThrow();
      expect(() => getCorrectTaxPercentAmount('')).toThrow();
    });
  });

  describe('getCorrectPriceWithTax', () => {
    it('rounds half-up to two decimals', () => {
      expect(getCorrectPriceWithTax(100, 0.23)).toBe(123);
      expect(getCorrectPriceWithTax(10.01, 0.23)).toBe(12.31);
      expect(getCorrectPriceWithTax(10, 0)).toBe(10);
    });
  });

  describe('getCorrectPriceWithTaxForArray', () => {
    it('rounds each line before summing', () => {
      expect(
        getCorrectPriceWithTaxForArray(
          [{ value: 10.01 }, { value: 10.01 }],
          0.23,
        ),
      ).toBe(24.62);
    });

    it('returns zero for an empty list', () => {
      expect(getCorrectPriceWithTaxForArray([], 0.23)).toBe(0);
    });
  });
});
