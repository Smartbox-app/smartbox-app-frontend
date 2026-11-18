import { useQuery } from '@tanstack/react-query';

import { BoxGroupUserRes } from 'smartbox-types';
import { currentAppLanguage } from 'src/i18n/app-language';
import ApiService from 'src/services/api-service';

export const boxGroupsForStockQueryKey = (stockId: string, lang = currentAppLanguage()) =>
  ['box-group-new', 'all', stockId, lang] as const;

export const useBoxGroupsForStockQuery = (stockId?: string) =>
  useQuery({
    queryKey: stockId
      ? boxGroupsForStockQueryKey(stockId)
      : ['box-group-new', 'all', 'missing'],
    queryFn: () =>
      ApiService.callFetch<BoxGroupUserRes[]>(
        'GET',
        `box-group-new/all/${stockId}`,
      ),
    enabled: !!stockId,
    retry: false,
  });
