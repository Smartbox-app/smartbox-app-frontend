import { useMutation, useQueryClient } from '@tanstack/react-query';
import ApiService from 'src/services/api-service';
import { rentNoteQueryKey } from 'src/queries/useRentNoteQuery/useRentNoteQuery';

export const useSetRentNoteMutation = (rentId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (note: string) => {
      if (!rentId) return;
      await ApiService.callFetch(
        'PATCH',
        `rent/${rentId}/note`,
        undefined,
        undefined,
        { note },
        true,
      );
    },
    onSuccess: async () => {
      if (rentId) {
        await queryClient.invalidateQueries({ queryKey: rentNoteQueryKey(rentId) });
      }
    },
  });
};

