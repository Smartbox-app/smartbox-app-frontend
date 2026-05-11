import { useQuery } from '@tanstack/react-query';
import ApiService from '../../services/api-service';
import { RentAuthorizedUserSummary } from 'smartbox-types';

export const useRentAuthorizedUsersQuery = (
  rentId: string,
  options?: { enabled?: boolean },
) => {
  const enabled = options?.enabled ?? true;

  return useQuery({
    queryKey:['rent-authorized-users', rentId] ,
    queryFn: async () => {
      const response = await ApiService.callFetch<RentAuthorizedUserSummary[]>(
        'GET',
        `rent/${rentId}/authorization`,
        undefined,
        undefined,
        undefined,
        undefined,
        true,
      );
      return response ?? [];
    },
    enabled: enabled && !!rentId,
    retry: false,
  });
};
