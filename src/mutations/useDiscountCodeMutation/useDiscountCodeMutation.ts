import { useMutation, useQueryClient } from '@tanstack/react-query';

import { GiftRes } from 'smartbox-types';
import { DiscountCodeDto } from 'src/dto/DiscountCodeDto';
import ApiService from 'src/services/api-service';

export const useDiscountCodeMutation = (stockId: string, boxGroupId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['discount'],
    mutationFn: async (dto: DiscountCodeDto) => {
      const response = await ApiService.callFetch<GiftRes>(
        'post',
        `gift/details/${stockId}/${boxGroupId}`,
        null,
        null,
        dto,
      );

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['my-details'],
      });
    },
  });
};
