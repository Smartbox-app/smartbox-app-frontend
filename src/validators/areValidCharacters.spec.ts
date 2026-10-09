import { hasValidCharacters } from './areValidCharacters';

describe('hasValidCharacters', () => {
  it('allows polish letters, digits, and empty values', () => {
    expect(hasValidCharacters('Zażółć gęślą jaźń 12')).toBe(true);
    expect(hasValidCharacters(null)).toBe(true);
    expect(hasValidCharacters(undefined)).toBe(true);
    expect(hasValidCharacters(12)).toBe(true);
  });

  it('rejects cyrillic letters and emoji', () => {
    expect(hasValidCharacters('Привет')).toBe(false);
    expect(hasValidCharacters('hello 😀')).toBe(false);
  });
});
