import { useMutation, useQueryClient } from '@tanstack/react-query';

import ApiService from 'src/services/api-service';

export type DeleteTemplateVariables = {
  id: string;
  tenantId?: string;
};

export const useDeleteTemplateMutation = () => {
  const queryClient = useQueryClient();

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['templates'] });
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
