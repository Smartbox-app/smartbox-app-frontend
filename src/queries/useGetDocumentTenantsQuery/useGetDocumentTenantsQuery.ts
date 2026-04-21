import { useQuery } from '@tanstack/react-query';
import ApiService from '../../services/api-service';
import { SelectOption } from 'src/types/select';

export const useGetDocumentTenantsQuery = () => {
  return useQuery({
    queryKey: ['document', 'tenants'],
    queryFn: async () => {
      const response = await ApiService.callFetch<SelectOption[]>(
        'get',
        'tenant/select',
      );

      return response || [];
    },
    gcTime: 600000,
    retry: false,
  });
};
