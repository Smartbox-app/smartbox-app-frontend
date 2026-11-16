import { useMutation } from '@tanstack/react-query';

import { CreateApiAccessReq, CreateApiAccessRes } from 'smartbox-types';
import { queryClient } from 'src/query-client';
import ApiService from 'src/services/api-service';

export const useCreateApiAccessMutation = () =>
  useMutation({
    mutationKey: ['api-access', 'create'],
    mutationFn: async (body: CreateApiAccessReq) => {
      const response = await ApiService.callFetch<CreateApiAccessRes>(
        'POST',
        'api-access',
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
