import { useCallback, useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import TagManager from 'react-gtm-module';
import { PaymentDetails } from 'smartbox-types';
import { useTenant } from 'src/hooks/useTenant';
import { history } from 'src/history';
import {
  captureAttributionParams,
  ensureAttributionOnUrl,
} from 'src/utils/attribution-params';
import {
  initMetaPixel,
  MetaInitiateCheckoutPayload,
  trackMetaCompleteRegistration,
  trackMetaInitiateCheckout,
  trackMetaPurchase,
} from 'src/utils/meta-pixel';
import { sumEcommerceTrackingValues } from 'src/utils/ecommerce-tracking-values';

export type TrackInitiateCheckoutPayload = MetaInitiateCheckoutPayload;

export type TrackPurchaseParams = {
  paymentId: string;
  details: PaymentDetails;
  /** Email provided during the order; sent as user_data for Google Ads enhanced conversions. */
  email?: string;
  userId?: string;
};

type TrackingUser = {
  email?: string;
  userId?: string;
};

const normalizeTrackingEmail = (email?: string) => {
  const normalized = email?.trim().toLowerCase();
  return normalized || undefined;
};

const buildUserData = ({ email, userId }: TrackingUser) => {
  const trackingEmail = normalizeTrackingEmail(email);
  if (!trackingEmail && !userId) return undefined;
  return {
    ...(trackingEmail ? { email: trackingEmail } : {}),
    ...(userId ? { user_id: userId } : {}),
  };
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

  useEffect(() => {
    if (!initialize) return;

    captureAttributionParams(location.search);
    ensureAttributionOnUrl((path) => history.replace(path));
  }, [initialize, location.pathname, location.search]);

  useEffect(() => {
    if (!initialize || !tenant) return;

    if (tenant.gtmId && initializedGtmIdRef.current !== tenant.gtmId) {
      TagManager.initialize({ gtmId: tenant.gtmId });
      initializedGtmIdRef.current = tenant.gtmId;
    }

    if (tenant.metaPixelId) {
      initMetaPixel(tenant.metaPixelId);
    }
  }, [initialize, tenant?.gtmId, tenant?.metaPixelId]);

  const trackCompleteRegistration = useCallback(() => {
    TagManager.dataLayer({
      dataLayer: {
        event: 'sign_up',
        method: 'email',
      },
    });

    trackMetaCompleteRegistration();
  }, []);

  const trackInitiateCheckout = useCallback(
    (payload: TrackInitiateCheckoutPayload) => {
      const itemId = payload.content_ids?.[0];
      const valueGross = payload.value_gross ?? payload.value;
      const valueNet = payload.value_net;
      const trackingEmail = normalizeTrackingEmail(payload.email);
      const user_data = buildUserData({
        email: trackingEmail,
        userId: payload.userId,
      });

      TagManager.dataLayer({
        dataLayer: {
          event: 'begin_checkout',
          ...(user_data ? { user_data } : {}),
          value_gross: valueGross,
          ...(valueNet != null ? { value_net: valueNet } : {}),
          ecommerce: {
            currency: payload.currency,
            value: valueGross,
            items: itemId
              ? [
                  {
                    item_id: itemId,
                    item_name: payload.content_name,
                    item_category: payload.content_type,
                    price: valueGross,
                    quantity: 1,
                  },
                ]
              : [],
          },
        },
      });

      trackMetaInitiateCheckout({
        ...payload,
        email: trackingEmail,
      });
    },
    [],
  );

  const trackPurchase = useCallback(
    ({ paymentId, details, email, userId }: TrackPurchaseParams) => {
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
      const contentIds = [
        groupId,
        ...addons.map((addon) => addon.slug).filter(Boolean),
      ];
      const trackingEmail = normalizeTrackingEmail(
        email || details.mailToSendInvoice,
      );
      const user_data = buildUserData({
        email: trackingEmail,
        userId,
      });

      TagManager.dataLayer({
        dataLayer: {
          event: 'purchase',
          ...(user_data ? { user_data } : {}),
          value_gross: valueGross,
          value_net: valueNet,
          ecommerce: {
            transaction_id: paymentId,
            value: valueGross,
            currency: 'PLN',
            items: [
              {
                item_id: groupId,
                item_name: contentName,
                item_category: type,
                price: rentItemPrice,
                quantity: 1,
              },
              addons.map((addon) => ({
                item_id: addon.slug,
                item_price: addon.grossPrice,
                item_name: addon.name,
              })),
            ],
          },
        },
      });

      trackMetaPurchase({
        value: valueGross,
        value_gross: valueGross,
        value_net: valueNet,
        currency: 'PLN',
        content_name: contentName,
        content_ids: contentIds,
        content_type: 'product',
        contents: [
          {
            id: groupId,
            quantity: 1,
            item_price: rentItemPrice,
          },
          ...addons.map((addon) => ({
            id: addon.slug,
            quantity: 1,
            item_price: Number(addon.grossPrice) || 0,
          })),
        ],
        num_items: 1 + addons.length,
        email: trackingEmail,
        userId,
      });
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
