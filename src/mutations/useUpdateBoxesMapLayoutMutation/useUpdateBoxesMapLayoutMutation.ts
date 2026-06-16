import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BoxesMapLayoutBatchReq } from 'smartbox-types';
import ApiService from 'src/services/api-service';
import { stockBoxesQueryKey } from 'src/queries/useGetStockBoxesQuery/useGetStockBoxesQuery';

export const useUpdateBoxesMapLayoutMutation = (stockId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (boxes: BoxesMapLayoutBatchReq['boxes']) => {
      if (!stockId) return;

      await ApiService.callFetch(
        'PATCH',
        'box/map-layout',
        undefined,
        undefined,
        { stockId, boxes } satisfies BoxesMapLayoutBatchReq,
        true,
      );
    },
    onSuccess: async () => {
      if (!stockId) return;

      await queryClient.invalidateQueries({
        queryKey: stockBoxesQueryKey(stockId),
      });
    },
  });
};
