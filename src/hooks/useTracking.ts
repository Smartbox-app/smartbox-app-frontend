import { useCallback, useEffect, useRef, useState } from 'react';
import TagManager from 'react-gtm-module';
import { useLocation } from 'react-router';

import { PaymentDetails, PaymentType } from 'smartbox-types';
import { history } from 'src/history';
import { useTenant } from 'src/hooks/useTenant';
import {
  captureAttributionParams,
  ensureAttributionOnUrl,
} from 'src/utils/attribution-params';
import {
  COOKIE_CONSENT_CHANGED_EVENT,
  hasAcceptedCookieConsent,
} from 'src/utils/cookie-consent';
import { sumEcommerceTrackingValues } from 'src/utils/ecommerce-tracking-values';
import {
  initMetaPixel,
  MetaInitiateCheckoutPayload,
  trackMetaCompleteRegistration,
  trackMetaInitiateCheckout,
  trackMetaPurchase,
} from 'src/utils/meta-pixel';

export type TrackInitiateCheckoutPayload = MetaInitiateCheckoutPayload;

export type TrackPurchaseParams = {
  paymentId: string;
  details: PaymentDetails;
  /** Email provided during the order; sent as user_data for Google Ads enhanced conversions. */
  email?: string;
  userId?: string;
};

const normalizeTrackingEmail = (email?: string) => {
  const normalized = email?.trim().toLowerCase();
  return normalized || undefined;
};

const TRACKING_PAYMENT_TYPE: Partial<Record<PaymentType, string>> = {
  [PaymentType.NewRent]: 'new_rent',
  [PaymentType.Extension]: 'extension',
  [PaymentType.PeriodPayment]: 'period_payment',
};

const toTrackingPaymentType = (type?: PaymentType) =>
  type ? TRACKING_PAYMENT_TYPE[type] : undefined;

const PURCHASE_TRACKED_PREFIX = 'sb-purchase-tracked:';

const hasTrackedPurchase = (paymentId: string) => {
  try {
    return (
      localStorage.getItem(`${PURCHASE_TRACKED_PREFIX}${paymentId}`) === '1'
    );
  } catch {
    return false;
  }
};

const markPurchaseTracked = (paymentId: string) => {
  try {
    localStorage.setItem(`${PURCHASE_TRACKED_PREFIX}${paymentId}`, '1');
  } catch {
    // Private mode or a full store should not block the rest of the page.
  }
};

const clearEcommerce = () => {
  TagManager.dataLayer({ dataLayer: { ecommerce: null } });
};

/** Enhanced conversions accept email here. user_id is a separate top-level field. */
const buildUserData = (email?: string) => {
  const trackingEmail = normalizeTrackingEmail(email);
  return trackingEmail ? { email: trackingEmail } : undefined;
};

type UseTrackingOptions = {
  /** When true, capture attribution and initialize GTM / Meta from tenant settings. */
  initialize?: boolean;
};

const useTracking = (options: UseTrackingOptions = {}) => {
  const { initialize = false } = options;
  const { tenant } = useTenant();
  const location = useLocation();
  const initializedGtmIdRef = useRef<string | null>(null);
  const [trackingAllowed, setTrackingAllowed] = useState(hasAcceptedCookieConsent);

  useEffect(() => {
    const sync = () => setTrackingAllowed(hasAcceptedCookieConsent());
    window.addEventListener(COOKIE_CONSENT_CHANGED_EVENT, sync);
    return () => window.removeEventListener(COOKIE_CONSENT_CHANGED_EVENT, sync);
  }, []);

  // First-party: keep campaign params across navigation regardless of ads consent.
  useEffect(() => {
    if (!initialize) return;

    captureAttributionParams(location.search);
    ensureAttributionOnUrl((path) => history.replace(path));
  }, [initialize, location.pathname, location.search]);

  useEffect(() => {
    if (!initialize || !trackingAllowed || !tenant) return;

    if (tenant.gtmId && initializedGtmIdRef.current !== tenant.gtmId) {
      TagManager.initialize({ gtmId: tenant.gtmId });
      initializedGtmIdRef.current = tenant.gtmId;
    }

    if (tenant.metaPixelId) {
      initMetaPixel(tenant.metaPixelId);
    }
  }, [initialize, trackingAllowed, tenant?.gtmId, tenant?.metaPixelId]);

  const trackCompleteRegistration = useCallback((email?: string) => {
    if (!hasAcceptedCookieConsent()) return;

    const user_data = buildUserData(email);

    TagManager.dataLayer({
      dataLayer: {
        event: 'sign_up',
        method: 'email',
        ...(user_data ? { user_data } : {}),
      },
    });

    trackMetaCompleteRegistration(user_data?.email);
  }, []);

  const trackInitiateCheckout = useCallback(
    (payload: TrackInitiateCheckoutPayload) => {
      if (!hasAcceptedCookieConsent()) return;

      const valueGross = payload.value_gross ?? payload.value;
      const valueNet = payload.value_net;
      const user_data = buildUserData(payload.email);
      const payment_type = payload.payment_type;
      const lineItems = payload.items?.length ? payload.items : [];

      clearEcommerce();
      TagManager.dataLayer({
        dataLayer: {
          event: 'begin_checkout',
          ...(payload.userId ? { user_id: payload.userId } : {}),
          ...(user_data ? { user_data } : {}),
          ...(payment_type ? { payment_type } : {}),
          value_gross: valueGross,
          ...(valueNet != null ? { value_net: valueNet } : {}),
          ecommerce: {
            currency: payload.currency,
            ...(payment_type ? { payment_type } : {}),
            value: valueGross,
            items: lineItems.map((item) => ({
              item_id: item.id,
              item_name: item.name,
              item_category: payment_type ?? payload.content_type,
              price: item.price,
              quantity: 1,
            })),
          },
        },
      });

      trackMetaInitiateCheckout({
        ...payload,
        email: user_data?.email,
      });
    },
    [],
  );

  const trackPurchase = useCallback(
    ({ paymentId, details, email, userId }: TrackPurchaseParams) => {
      if (!hasAcceptedCookieConsent()) return;
      if (hasTrackedPurchase(paymentId)) return;

      const { price, addons, type, name, groupId, area, rentGrossPrice } =
        details;

      const rentPeriod = price?.[0];
      const { valueGross, valueNet } = sumEcommerceTrackingValues(
        rentPeriod
          ? { grossPrice: rentPeriod.grossPrice, netPrice: rentPeriod.netPrice }
          : undefined,
        addons,
        rentGrossPrice,
      );
      const rentItemPrice = rentPeriod?.grossPrice ?? rentGrossPrice;
      const contentName = `${name} - ${area}m²`;
      const addonItems = addons
        .filter((addon) => addon.slug)
        .map((addon) => ({
          id: addon.slug,
          name: addon.name,
          price: Number(addon.grossPrice) || 0,
        }));
      const lineItems = [
        {
          id: groupId,
          name: contentName,
          price: rentItemPrice,
        },
        ...addonItems,
      ];
      const user_data = buildUserData(email);
      const payment_type = toTrackingPaymentType(type);

      clearEcommerce();
      TagManager.dataLayer({
        dataLayer: {
          event: 'purchase',
          ...(userId ? { user_id: userId } : {}),
          ...(user_data ? { user_data } : {}),
          ...(payment_type ? { payment_type } : {}),
          value_gross: valueGross,
          value_net: valueNet,
          ecommerce: {
            transaction_id: paymentId,
            ...(payment_type ? { payment_type } : {}),
            value: valueGross,
            currency: 'PLN',
            items: lineItems.map((item, index) => {
              if (index === 0) {
                return {
                  item_id: item.id,
                  item_name: item.name,
                  item_category: payment_type ?? type,
                  price: item.price,
                  quantity: 1,
                };
              }
              return {
                item_id: item.id,
                item_name: item.name,
                price: item.price,
                quantity: 1,
              };
            }),
          },
        },
      });

      trackMetaPurchase({
        value: valueGross,
        value_gross: valueGross,
        value_net: valueNet,
        currency: 'PLN',
        content_name: contentName,
        content_ids: lineItems.map((item) => item.id),
        content_type: 'product',
        contents: lineItems.map((item) => ({
          id: item.id,
          quantity: 1,
          item_price: item.price,
        })),
        num_items: lineItems.length,
        ...(payment_type ? { payment_type } : {}),
        order_id: paymentId,
        eventId: paymentId,
        email: user_data?.email,
        userId,
      });
      markPurchaseTracked(paymentId);
    },
    [],
  );

  return {
    trackCompleteRegistration,
    trackInitiateCheckout,
    trackPurchase,
  };
};

export { useTracking };
