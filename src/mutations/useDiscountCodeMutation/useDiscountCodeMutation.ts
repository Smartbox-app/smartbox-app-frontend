import { useMutation, useQueryClient } from '@tanstack/react-query';
import ApiService from '../../services/api-service';
import { GiftRes } from 'smartbox-types';
import { DiscountCodeDto } from 'src/dto/DiscountCodeDto';

export const useDiscountCodeMutation = (stockId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['discount'],
    mutationFn: async (dto: DiscountCodeDto) => {
      const response = await ApiService.callFetch<GiftRes>(
        'post',
        `gift/details/${stockId}`,
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
