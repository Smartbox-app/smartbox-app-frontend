const ATTRIBUTION_STORAGE_KEY = 'smartbox-attribution-params';

const ATTRIBUTION_KEYS = new Set([
  'fbclid',
  'gclid',
  '_gl',
]);

const isAttributionParam = (key: string) =>
  ATTRIBUTION_KEYS.has(key) || key.startsWith('utm_');

export const pickAttributionParams = (
  search: string,
): Record<string, string> => {
  const params = new URLSearchParams(
    search.startsWith('?') ? search.slice(1) : search,
  );
  const picked: Record<string, string> = {};

  params.forEach((value, key) => {
    if (isAttributionParam(key) && value) {
      picked[key] = value;
    }
  });

  return picked;
};

export const captureAttributionParams = (search = window.location.search) => {
  const picked = pickAttributionParams(search);
  if (Object.keys(picked).length === 0) return;

  try {
    const existing = getStoredAttributionParams();
    sessionStorage.setItem(
      ATTRIBUTION_STORAGE_KEY,
      JSON.stringify({ ...existing, ...picked }),
    );
  } catch {
    // ignore storage failures
  }
};

export const getStoredAttributionParams = (): Record<string, string> => {
  try {
    const raw = sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

export const getAttributionSearch = (): string => {
  const fromUrl = pickAttributionParams(window.location.search);
  const stored = getStoredAttributionParams();
  const merged = { ...stored, ...fromUrl };
  const params = new URLSearchParams(merged);
  const result = params.toString();
  return result ? `?${result}` : '';
};

export const withAttributionSearch = (path: string): string => {
  const [pathname, existingSearch = ''] = path.split('?');
  const existing = pickAttributionParams(existingSearch);
  const stored = getStoredAttributionParams();
  const merged = { ...stored, ...existing };
  const params = new URLSearchParams(merged);
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
};

/** Re-attach stored attribution params to the current URL before trackers init. */
export const ensureAttributionOnUrl = (
  replace?: (path: string) => void,
) => {
  captureAttributionParams();

  const stored = getStoredAttributionParams();
  if (Object.keys(stored).length === 0) return;

  const current = pickAttributionParams(window.location.search);
  const missing = Object.keys(stored).some((key) => !(key in current));
  if (!missing) return;

  const merged = { ...stored, ...current };
  const params = new URLSearchParams(merged);
  const next = `${window.location.pathname}?${params.toString()}${window.location.hash}`;
  const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;

  if (currentPath === next) return;

  if (replace) {
    replace(next);
  } else {
    window.history.replaceState(window.history.state, '', next);
  }
};
