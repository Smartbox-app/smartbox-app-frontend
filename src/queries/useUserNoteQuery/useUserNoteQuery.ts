import { useQuery } from '@tanstack/react-query';
import ApiService from 'src/services/api-service';

export type UserNote = {
  note: string | null;
};

export const userNoteQueryKey = (userId: string) =>
  ['user', 'note', userId] as const;

export const useUserNoteQuery = (userId?: string) => {
  return useQuery({
    enabled: !!userId,
    queryKey: userId ? userNoteQueryKey(userId) : ['user', 'note', 'missing'],
    queryFn: async () => {
      if (!userId) return { note: null } as UserNote;
      try {
        const data = await ApiService.callFetch<UserNote>(
          'GET',
          `user/${userId}/note`,
          undefined,
          undefined,
          undefined,
          false,
          true,
        );

        return data;
      } catch {
        return { note: null } as UserNote;
      }
    },
    retry: false,
  });
};
