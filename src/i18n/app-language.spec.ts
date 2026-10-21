import { detectBrowserLanguage, isAppLanguage } from './app-language';

describe('detectBrowserLanguage', () => {
  it('uses the first supported language in the list', () => {
    expect(detectBrowserLanguage(['de-DE', 'en-US', 'pl'])).toBe('en');
    expect(detectBrowserLanguage(['fr', 'pl-PL'])).toBe('pl');
  });

  it('falls back to Polish when nothing matches', () => {
    expect(detectBrowserLanguage(['de', 'fr'])).toBe('pl');
    expect(detectBrowserLanguage([])).toBe('pl');
  });
});

describe('isAppLanguage', () => {
  it('accepts only pl and en', () => {
    expect(isAppLanguage('pl')).toBe(true);
    expect(isAppLanguage('en')).toBe(true);
    expect(isAppLanguage('de')).toBe(false);
    expect(isAppLanguage(null)).toBe(false);
  });
});
