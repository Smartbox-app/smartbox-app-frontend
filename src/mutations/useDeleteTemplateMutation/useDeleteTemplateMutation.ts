import { useMutation, useQueryClient } from '@tanstack/react-query';

import { templateListQueryKey } from 'src/queries';
import ApiService from 'src/services/api-service';

export type DeleteTemplateVariables = {
  id: string;
  tenantId?: string;
};

export const useDeleteTemplateMutation = () => {
  const queryClient = useQueryClient();

  const handleSuccess = (
    _data: unknown,
    { tenantId }: DeleteTemplateVariables,
  ) => {
    queryClient.invalidateQueries({
      queryKey: templateListQueryKey(tenantId),
    });
  };

  return useMutation({
    mutationKey: ['template', 'delete'],
    mutationFn: async ({ id, tenantId }: DeleteTemplateVariables) => {
      const url = tenantId
        ? `template/admin/${tenantId}/${id}`
        : `template/${id}`;
      await ApiService.callFetch(
        'DELETE',
        url,
        undefined,
        undefined,
        undefined,
        true,
      );
    },
    onSuccess: handleSuccess,
  });
};
