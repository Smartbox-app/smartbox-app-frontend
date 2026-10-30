import {
  COOKIE_CONSENT_KEY,
  clearCookieConsent,
  getCookieConsent,
  hasAcceptedCookieConsent,
  setCookieConsent,
} from 'src/utils/cookie-consent';

describe('cookie consent', () => {
  const store = new Map<string, string>();

  beforeEach(() => {
    store.clear();
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: {
        getItem: (key: string) => store.get(key) ?? null,
        setItem: (key: string, value: string) => {
          store.set(key, String(value));
        },
        removeItem: (key: string) => {
          store.delete(key);
        },
        clear: () => store.clear(),
      },
    });
  });

  it('reads accepted / rejected', () => {
    expect(getCookieConsent()).toBeNull();
    expect(hasAcceptedCookieConsent()).toBe(false);

    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    expect(getCookieConsent()).toBe('accepted');
    expect(hasAcceptedCookieConsent()).toBe(true);

    localStorage.setItem(COOKIE_CONSENT_KEY, 'rejected');
    expect(getCookieConsent()).toBe('rejected');
    expect(hasAcceptedCookieConsent()).toBe(false);
  });

  it('migrates legacy true values', () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    expect(getCookieConsent()).toBe('accepted');

    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(true));
    expect(getCookieConsent()).toBe('accepted');
  });

  it('persists and notifies', () => {
    const listener = jest.fn();
    window.addEventListener('cookie-consent-changed', listener);

    setCookieConsent('accepted');
    expect(localStorage.getItem(COOKIE_CONSENT_KEY)).toBe('accepted');
    expect(listener).toHaveBeenCalledTimes(1);

    setCookieConsent('rejected');
    expect(localStorage.getItem(COOKIE_CONSENT_KEY)).toBe('rejected');
    expect(listener).toHaveBeenCalledTimes(2);

    clearCookieConsent();
    expect(localStorage.getItem(COOKIE_CONSENT_KEY)).toBeNull();
    expect(getCookieConsent()).toBeNull();
    expect(listener).toHaveBeenCalledTimes(3);

    window.removeEventListener('cookie-consent-changed', listener);
  });
});
