import { useMutation } from '@tanstack/react-query';

import { ApiAccessRes, UpdateApiAccessReq } from 'smartbox-types';
import { queryClient } from 'src/query-client';
import ApiService from 'src/services/api-service';

export const useUpdateApiAccessMutation = () =>
  useMutation({
    mutationKey: ['api-access', 'update'],
    mutationFn: async ({
      id,
      body,
    }: {
      id: string;
      body: UpdateApiAccessReq;
    }) => {
      const response = await ApiService.callFetch<ApiAccessRes>(
        'PATCH',
        `api-access/${id}`,
        undefined,
        undefined,
        body,
        true,
      );

      return response;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['api-table'] });
    },
  });
