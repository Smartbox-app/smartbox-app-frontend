import { detectBrowserLanguage, isAppLanguage } from './app-language';

describe('detectBrowserLanguage', () => {
  it('uses the first supported language in the list', () => {
    expect(detectBrowserLanguage(['de-DE', 'en-US', 'pl'])).toBe('de');
    expect(detectBrowserLanguage(['cs-CZ', 'en'])).toBe('cz');
    expect(detectBrowserLanguage(['uk-UA'])).toBe('ua');
    expect(detectBrowserLanguage(['cz', 'ua'])).toBe('cz');
    expect(detectBrowserLanguage(['ua'])).toBe('ua');
    expect(detectBrowserLanguage(['fr', 'pl-PL'])).toBe('pl');
  });

  it('falls back to Polish when nothing matches', () => {
    expect(detectBrowserLanguage(['fr', 'es'])).toBe('pl');
    expect(detectBrowserLanguage([])).toBe('pl');
  });
});

describe('isAppLanguage', () => {
  it('accepts the supported languages', () => {
    expect(isAppLanguage('pl')).toBe(true);
    expect(isAppLanguage('en')).toBe(true);
    expect(isAppLanguage('cz')).toBe(true);
    expect(isAppLanguage('ua')).toBe(true);
    expect(isAppLanguage('de')).toBe(true);
    expect(isAppLanguage('cs')).toBe(false);
    expect(isAppLanguage('uk')).toBe(false);
    expect(isAppLanguage('fr')).toBe(false);
    expect(isAppLanguage(null)).toBe(false);
  });
});
