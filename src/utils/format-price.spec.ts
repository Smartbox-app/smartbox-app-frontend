import { formatPrice, formatThousands } from 'src/utils/format-price';

describe('formatThousands', () => {
  it('groups thousands and uses a decimal comma', () => {
    expect(formatThousands(1234.5)).toBe('1 234,50');
    expect(formatThousands(1000000)).toBe('1 000 000,00');
    expect(formatThousands(999.9)).toBe('999,90');
  });

  it('keeps the sign in front of the grouped digits', () => {
    expect(formatThousands(-1234.56)).toBe('-1 234,56');
  });

  it('uses a non-breaking space when the value is rendered as html', () => {
    expect(formatThousands(1234.5, true)).toBe('1&nbsp;234,50');
  });

  it('honors a custom fraction length', () => {
    expect(formatThousands(1500.4, false, 0)).toBe('1 500');
  });
});

describe('formatPrice', () => {
  it('appends the zloty suffix', () => {
    expect(formatPrice(1234.5)).toBe('1 234,50 zł');
  });
});
