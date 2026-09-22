import { useMutation } from '@tanstack/react-query';
import { ApiAccessRes, UpdateApiAccessReq } from 'smartbox-types';
import ApiService from '../../services/api-service';

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
  });
