import { useQueries } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { CalculatedAddonPriceRes, RentPaymentType } from 'smartbox-types';
import { clearAddonPrice } from 'src/actions/order';
import type { OrderState } from 'src/reducers/order-reducer';
import ApiService from 'src/services/api-service';

const formatOnlyDate = (date: Date) => format(date, 'yyyy-MM-dd');

type UseSyncAddonPricesToReduxParams = {
  orderAddons: OrderState['orderAddons'];
  startDate: Date;
  endDate: Date | null;
  rentPaymentType: RentPaymentType | null;
  boxGroupId?: string;
  openEnded?: boolean;
};

export const useSyncAddonPricesToRedux = ({
  orderAddons,
  startDate,
  endDate,
  rentPaymentType,
  boxGroupId,
  openEnded = false,
}: UseSyncAddonPricesToReduxParams) => {
  const dispatch = useDispatch();

  const addonEntries = useMemo(
    () => Object.entries(orderAddons),
    [orderAddons],
  );

  const paymentType = rentPaymentType ?? RentPaymentType.InAdvance;
  const startKey = formatOnlyDate(startDate);
  const endKey = endDate ? formatOnlyDate(endDate) : '';

  const queries = useQueries({
    queries: addonEntries.map(([addonId, addon]) => {
      const variantId = addon.selectedVariant;
      const enabled =
        !!boxGroupId &&
        !!variantId &&
        (openEnded || (!!endDate && rentPaymentType != null));

      return {
        queryKey: [
          'addon',
          'price',
          addonId,
          startKey,
          endKey,
          paymentType,
          variantId,
          boxGroupId,
          openEnded,
        ],
        queryFn: async (): Promise<CalculatedAddonPriceRes | null> => {
          if (!variantId || !boxGroupId) return null;

          if (openEnded) {
            return (
              (await ApiService.callFetch<CalculatedAddonPriceRes>(
                'GET',
                `addon/price-open-ended/${addonId}/${formatOnlyDate(startDate)}/${variantId}/${boxGroupId}`,
              )) ?? null
            );
          }

          if (!endDate || rentPaymentType == null) return null;

          return (
            (await ApiService.callFetch<CalculatedAddonPriceRes>(
              'GET',
              `addon/price/${addonId}/${formatOnlyDate(startDate)}/${formatOnlyDate(endDate)}/${rentPaymentType}/${variantId}/${boxGroupId}`,
            )) ?? null
          );
        },
        enabled,
        retry: false,
      };
    }),
  });

  const queryResultsSignature = queries
    .map((query) =>
      query.data ? `${query.dataUpdatedAt}:${query.data.variantId}` : 'empty',
    )
    .join('|');
  const selectionKey = addonEntries
    .map(([addonId, addon]) => `${addonId}:${addon.selectedVariant ?? ''}`)
    .join('|');

  useEffect(() => {
    addonEntries.forEach(([addonId, addon], index) => {
      if (!addon.selectedVariant) {
        if (addon.price != null) dispatch(clearAddonPrice(addonId));
        return;
      }

      const result = queries[index]?.data;
      if (result) {
        dispatch({
          type: 'CALCULATE_VARIANT_PRICE_SUCCESS',
          payload: result,
        });
      }
    });
    // queries omitted: useQueries returns a new array every render and was
    // re-dispatching into Redux in a loop (calendar DOM kept detaching).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, queryResultsSignature, selectionKey]);
};
