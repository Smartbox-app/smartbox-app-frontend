import { useMutation, useQueryClient } from '@tanstack/react-query';

import { LocationActivityListItem } from 'smartbox-types';
import { locationActivityQueryKey } from 'src/queries/useLocationActivityQuery';
import ApiService from 'src/services/api-service';

export const useToggleLocationActivityMutation = (stockId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (activityId: string) =>
      ApiService.callFetch<LocationActivityListItem>(
        'PATCH',
        `location-activity/stock/${stockId}/${activityId}/toggle`,
        undefined,
        undefined,
        undefined,
        true,
      ),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: locationActivityQueryKey(stockId),
      });
    },
  });
};

export const useClearLocationActivityMutation = (stockId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      ApiService.callFetch<{ deletedCount: number }>(
        'DELETE',
        `location-activity/stock/${stockId}`,
        undefined,
        undefined,
        undefined,
        true,
      ),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: locationActivityQueryKey(stockId),
      });
    },
  });
};
