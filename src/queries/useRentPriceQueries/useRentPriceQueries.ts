import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import {
  AddonRes,
  CalculatedAddonPriceRes,
  CalculatedPriceRes,
  RentPaymentType,
} from 'smartbox-types';
import ApiService from '../../services/api-service';

const formatOnlyDate = (date: Date) => format(date, 'yyyy-MM-dd');

type UseBoxGroupPriceQueryParams = {
  boxGroupId?: string;
  start?: Date;
  end?: Date;
  type?: RentPaymentType;
  code?: string;
  openEnded?: boolean;
  enabled?: boolean;
};

export const useBoxGroupPriceQuery = ({
  boxGroupId,
  start,
  end,
  type,
  code,
  openEnded = false,
  enabled = true,
}: UseBoxGroupPriceQueryParams) => {
  const startKey = start ? formatOnlyDate(start) : '';
  const endKey = end ? formatOnlyDate(end) : '';

  return useQuery({
    queryKey: [
      'box-group-new',
      'price',
      boxGroupId,
      startKey,
      endKey,
      type,
      code ?? '',
      openEnded,
    ],
    queryFn: async () => {
      if (!boxGroupId || !start) return null;

      if (openEnded) {
        const base = `box-group-new/price-open-ended/${boxGroupId}/${formatOnlyDate(start)}`;
        const path = code ? `${base}/${code}` : base;
        return ApiService.callFetch<CalculatedPriceRes>('GET', path);
      }

      if (!end || type == null) return null;

      const base = `box-group-new/price/${boxGroupId}/${formatOnlyDate(start)}/${formatOnlyDate(end)}/${type}`;
      const path = code ? `${base}/${code}` : base;
      return ApiService.callFetch<CalculatedPriceRes>('GET', path);
    },
    enabled:
      enabled &&
      !!boxGroupId &&
      !!start &&
      (openEnded || (!!end && type != null)),
    retry: false,
  });
};

type UsePriceForRentQueryParams = {
  rentId?: string;
  start?: Date;
  end?: Date;
  type?: RentPaymentType;
  code?: string;
  enabled?: boolean;
};

export const usePriceForRentQuery = ({
  rentId,
  start,
  end,
  type,
  code,
  enabled = true,
}: UsePriceForRentQueryParams) => {
  const startKey = start ? formatOnlyDate(start) : '';
  const endKey = end ? formatOnlyDate(end) : '';

  return useQuery({
    queryKey: [
      'box-group-new',
      'price-for-rent',
      rentId,
      startKey,
      endKey,
      type,
      code ?? '',
    ],
    queryFn: () =>
      ApiService.callFetch<CalculatedPriceRes>(
        'GET',
        `box-group-new/price-for-rent/${rentId}/${formatOnlyDate(start!)}/${formatOnlyDate(end!)}/${type}/${code || ''}`,
      ),
    enabled: enabled && !!rentId && !!start && !!end && type != null,
    retry: false,
  });
};

type UseAddonPriceQueryParams = {
  addonId?: string;
  start?: Date;
  end?: Date;
  type?: RentPaymentType;
  variantId?: string;
  boxGroupId?: string;
  openEnded?: boolean;
  enabled?: boolean;
};

export const useAddonPriceQuery = ({
  addonId,
  start,
  end,
  type,
  variantId,
  boxGroupId,
  openEnded = false,
  enabled = true,
}: UseAddonPriceQueryParams) => {
  const startKey = start ? formatOnlyDate(start) : '';
  const endKey = end ? formatOnlyDate(end) : '';

  return useQuery({
    queryKey: [
      'addon',
      'price',
      addonId,
      startKey,
      endKey,
      type,
      variantId,
      boxGroupId,
      openEnded,
    ],
    queryFn: async () => {
      if (!addonId || !start || !variantId || !boxGroupId) return null;

      if (openEnded) {
        return ApiService.callFetch<CalculatedAddonPriceRes>(
          'GET',
          `addon/price-open-ended/${addonId}/${formatOnlyDate(start)}/${variantId}/${boxGroupId}`,
        );
      }

      if (!end || type == null) return null;

      return ApiService.callFetch<CalculatedAddonPriceRes>(
        'GET',
        `addon/price/${addonId}/${formatOnlyDate(start)}/${formatOnlyDate(end)}/${type}/${variantId}/${boxGroupId}`,
      );
    },
    enabled:
      enabled &&
      !!addonId &&
      !!start &&
      !!variantId &&
      !!boxGroupId &&
      (openEnded || (!!end && type != null)),
    retry: false,
  });
};

export const addonsForOrderQueryKey = (stockId: string, boxGroupId: string) =>
  ['addon', 'all', stockId, boxGroupId] as const;

export const useAddonsForOrderQuery = (
  stockId?: string,
  boxGroupId?: string,
  enabled = true,
) =>
  useQuery({
    queryKey:
      stockId && boxGroupId
        ? addonsForOrderQueryKey(stockId, boxGroupId)
        : ['addon', 'all', 'missing'],
    queryFn: () =>
      ApiService.callFetch<AddonRes[]>(
        'GET',
        `addon/all/${stockId}/${boxGroupId}`,
      ),
    enabled: enabled && !!stockId && !!boxGroupId,
    retry: false,
  });
