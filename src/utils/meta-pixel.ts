type FbqFunction = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[];
  loaded?: boolean;
  version?: string;
  push?: (...args: unknown[]) => void;
};

declare global {
  interface Window {
    fbq?: FbqFunction;
    _fbq?: FbqFunction;
  }
}

let initializedPixelId: string | null = null;

export type MetaEcommerceValuePayload = {
  /** Primary conversion value (gross) used for optimization. */
  value: number;
  currency: string;
  value_gross?: number;
  value_net?: number;
};

export type MetaPurchasePayload = MetaEcommerceValuePayload & {
  content_name?: string;
  content_ids?: string[];
  content_type?: string;
  contents?: Array<{
    id: string;
    quantity: number;
    item_price?: number;
  }>;
  num_items?: number;
  /** Plain-text email for Advanced Matching; hashed by the pixel (SHA-256). */
  email?: string;
  /** App user id; sent as Meta `external_id`. */
  userId?: string;
};

export type MetaInitiateCheckoutPayload = MetaEcommerceValuePayload & {
  content_name?: string;
  content_ids?: string[];
  content_type?: string;
  email?: string;
  userId?: string;
};

const ensureFbqStub = () => {
  if (window.fbq) return window.fbq;

  const fbq: FbqFunction = function (...args: unknown[]) {
    if (fbq.callMethod) {
      fbq.callMethod(...args);
    } else {
      (fbq.queue = fbq.queue || []).push(args);
    }
  };
  fbq.queue = [];
  fbq.loaded = true;
  fbq.version = '2.0';
  fbq.push = fbq;

  window.fbq = fbq;
  if (!window._fbq) window._fbq = fbq;

  return fbq;
};

const injectPixelScript = () => {
  if (document.getElementById('meta-pixel-script')) return;

  const script = document.createElement('script');
  script.id = 'meta-pixel-script';
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  const firstScript = document.getElementsByTagName('script')[0];
  firstScript?.parentNode?.insertBefore(script, firstScript);
};

export const initMetaPixel = (pixelId: string) => {
  if (!pixelId || initializedPixelId === pixelId) return;

  const fbq = ensureFbqStub();
  injectPixelScript();
  fbq('init', pixelId);
  fbq('track', 'PageView');
  initializedPixelId = pixelId;
};

/** Attaches customer data for Meta Advanced Matching (pixel hashes it). */
export const setMetaUserData = (user?: { email?: string; userId?: string }) => {
  if (!window.fbq || !initializedPixelId) return;
  if (!user?.email && !user?.userId) {
    window.fbq('init', initializedPixelId);
    return;
  }
  window.fbq('init', initializedPixelId, {
    ...(user.email ? { em: user.email } : {}),
    ...(user.userId ? { external_id: user.userId } : {}),
  });
};

export const trackMetaEvent = (
  event: string,
  params?: Record<string, unknown>,
) => {
  if (!window.fbq || !initializedPixelId) return;
  if (params) {
    window.fbq('track', event, params);
  } else {
    window.fbq('track', event);
  }
};

export const trackMetaCompleteRegistration = () => {
  trackMetaEvent('CompleteRegistration');
};

export const trackMetaInitiateCheckout = (
  payload: MetaInitiateCheckoutPayload,
) => {
  const { email, userId, ...eventPayload } = payload;
  setMetaUserData({ email, userId });
  trackMetaEvent('InitiateCheckout', eventPayload);
};

export const trackMetaPurchase = (payload: MetaPurchasePayload) => {
  const { email, userId, ...eventPayload } = payload;
  setMetaUserData({ email, userId });
  trackMetaEvent('Purchase', eventPayload);
};

export const isMetaPixelReady = () =>
  Boolean(window.fbq && initializedPixelId);
