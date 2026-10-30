export type CookieConsent = 'accepted' | 'rejected';

export const COOKIE_CONSENT_KEY = 'cookies';
export const COOKIE_CONSENT_CHANGED_EVENT = 'cookie-consent-changed';

const parseStoredConsent = (raw: string | null): CookieConsent | null => {
  if (!raw) return null;

  if (raw === 'accepted' || raw === 'rejected') return raw;

  // Legacy banner stored JSON.stringify(true) → '"true"' or bare true via older e2e.
  try {
    const parsed = JSON.parse(raw);
    if (parsed === true) return 'accepted';
  } catch {
    if (raw === 'true') return 'accepted';
  }

  return null;
};

export const getCookieConsent = (): CookieConsent | null => {
  try {
    return parseStoredConsent(localStorage.getItem(COOKIE_CONSENT_KEY));
  } catch {
    return null;
  }
};

export const hasAcceptedCookieConsent = () => getCookieConsent() === 'accepted';

export const setCookieConsent = (value: CookieConsent) => {
  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, value);
  } catch {
    // Private mode should not block the UI.
  }
  window.dispatchEvent(new Event(COOKIE_CONSENT_CHANGED_EVENT));
};

export const clearCookieConsent = () => {
  try {
    localStorage.removeItem(COOKIE_CONSENT_KEY);
  } catch {
    // Private mode should not block the UI.
  }
  window.dispatchEvent(new Event(COOKIE_CONSENT_CHANGED_EVENT));
};
