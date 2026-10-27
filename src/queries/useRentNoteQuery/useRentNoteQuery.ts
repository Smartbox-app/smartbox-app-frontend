import { useQuery } from '@tanstack/react-query';

import ApiService from 'src/services/api-service';

export type RentNote = {
  note: string | null;
};

export const rentNoteQueryKey = (rentId: string) =>
  ['rent', 'note', rentId] as const;

export const useRentNoteQuery = (rentId?: string) => {
  return useQuery({
    enabled: !!rentId,
    queryKey: rentId ? rentNoteQueryKey(rentId) : ['rent', 'note', 'missing'],
    queryFn: async () => {
      if (!rentId) return { note: null } as RentNote;
      try {
        const data = await ApiService.callFetch<RentNote>(
          'GET',
          `rent/${rentId}/note`,
          undefined,
          undefined,
          undefined,
          false,
          true, // muteNotification: note missing shouldn't toast
        );

        return data;
      } catch {
        return { note: null } as RentNote;
      }
    },
    retry: false,
  });
};
