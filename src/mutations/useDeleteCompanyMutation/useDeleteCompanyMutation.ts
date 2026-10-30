import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';

import { refreshApiTableData } from 'src/actions/api-table';
import { successNotification } from 'src/actions/notifications';
import ApiService from 'src/services/api-service';

export const useDeleteCompanyMutation = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationKey: ['company', 'delete'],
    mutationFn: async (companyId: string) => {
      await ApiService.callFetch('DELETE', `company/${companyId}`);
    },
    onSuccess: () => {
      dispatch(successNotification('application.companyDeleted'));
      dispatch(refreshApiTableData());
    },
  });
};
