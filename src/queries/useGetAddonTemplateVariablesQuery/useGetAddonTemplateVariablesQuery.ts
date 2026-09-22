import { useQuery } from '@tanstack/react-query';
import { AddonTemplateVariableRes } from 'smartbox-types';
import ApiService from '../../services/api-service';

export const addonTemplateVariablesQueryKey = (stockId?: string | null) =>
  ['addon', 'template-variables', stockId] as const;

type UseGetAddonTemplateVariablesQueryOptions = {
  stockId?: string | null;
  enabled?: boolean;
};

export const useGetAddonTemplateVariablesQuery = (
  options?: UseGetAddonTemplateVariablesQueryOptions,
) => {
  const { stockId, enabled = true } = options ?? {};

  return useQuery({
    queryKey: addonTemplateVariablesQueryKey(stockId),
    enabled: enabled && !!stockId,
    queryFn: async () => {
      const response = await ApiService.callFetch<AddonTemplateVariableRes[]>(
        'GET',
        `addon/template-variables/${stockId}`,
        undefined,
        undefined,
        undefined,
        false,
        true,
      );

      return response ?? [];
    },
    retry: false,
  });
};
