import { useQuery } from '@tanstack/react-query';

import { BoxGroupOrderRes } from 'smartbox-types';
import { currentAppLanguage } from 'src/i18n/app-language';
import ApiService from 'src/services/api-service';

export const boxGroupForOrderQueryKey = (
  boxGroupId: string,
  lang = currentAppLanguage(),
) => ['box-group-new', 'order', boxGroupId, lang] as const;

export const useBoxGroupForOrderQuery = (boxGroupId?: string) =>
  useQuery({
    enabled: !!boxGroupId,
    queryKey: boxGroupId
      ? boxGroupForOrderQueryKey(boxGroupId)
      : ['box-group-new', 'order', 'missing'],
    queryFn: () =>
      ApiService.callFetch<BoxGroupOrderRes>(
        'GET',
        `box-group-new/order/${boxGroupId}`,
      ),
    retry: false,
  });
