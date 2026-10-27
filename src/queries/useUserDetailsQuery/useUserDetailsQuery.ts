import { useQuery } from '@tanstack/react-query';

import { UserRes } from 'smartbox-types';
import ApiService from 'src/services/api-service';

export const userDetailsQueryKey = (userId: string) =>
  ['user', 'details', userId] as const;

export const useUserDetailsQuery = (userId?: string) =>
  useQuery({
    queryKey: userId
      ? userDetailsQueryKey(userId)
      : ['user', 'details', 'missing'],
    queryFn: () =>
      ApiService.callFetch<UserRes>('GET', `user/details/${userId}`),
    enabled: !!userId,
    retry: false,
  });
