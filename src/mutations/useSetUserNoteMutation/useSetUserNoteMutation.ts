import { useMutation, useQueryClient } from '@tanstack/react-query';
import ApiService from 'src/services/api-service';
import { userNoteQueryKey } from 'src/queries/useUserNoteQuery/useUserNoteQuery';

export const useSetUserNoteMutation = (userId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (note: string) => {
      if (!userId) return;
      await ApiService.callFetch(
        'PATCH',
        `user/${userId}/note`,
        undefined,
        undefined,
        { note },
        true,
      );
    },
    onSuccess: async () => {
      if (userId) {
        await queryClient.invalidateQueries({ queryKey: userNoteQueryKey(userId) });
      }
    },
  });
};

