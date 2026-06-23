import { useQuery } from '@tanstack/react-query';
import { AddonTemplateVariableRes } from 'smartbox-types';
import ApiService from '../../services/api-service';

export const addonTemplateVariablesQueryKey = () =>
  ['addon', 'template-variables'] as const;

export const useGetAddonTemplateVariablesQuery = () => {
  return useQuery({
    queryKey: addonTemplateVariablesQueryKey(),
    queryFn: async () => {
      const response = await ApiService.callFetch<AddonTemplateVariableRes[]>(
        'GET',
        `addon/template-variables`,
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
